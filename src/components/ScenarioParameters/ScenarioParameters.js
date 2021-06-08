// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import { SCENARIO_RUN_STATE } from '../../utils/ApiUtils';
import { SCENARIO_PARAMETERS_TABS_CONFIG } from '../../configs/ScenarioParametersTabs.config';
import { EditModeButton, NormalModeButton, ScenarioParametersTabs } from './components';
import { useTranslation } from 'react-i18next';
import { SimpleTwoActionsDialog } from '@cosmotech/ui';
import { BasicTypes, BarParameters, FileUpload } from './components/tabs';
import { ORGANISATION_ID, acceptedFileTypesToUpload } from '../../configs/App.config';
import WorkspaceService from '../../services/workspace/WorkspaceService.js';
import DatasetService from '../../services/dataset/DatasetService.js';
import fileDownload from 'js-file-download';
import { UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui/src/UploadFile/StatusConstants';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    background: theme.palette.background.secondary,
    color: '#FFFFFF',
    marginLeft: '30px',
    height: '50px',
    paddingTop: '10px'
  },
  rightBar: {
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    margin: `0 ${theme.spacing(3)}px`
  }
}));

// TODO Move in Constant file
const parameterName = 'initial_stock_dataset';
const connectorId = 'C-XPv4LBVGAL';
const STORAGE_ROOT_DIR_PLACEHOLDER = '%WORKSPACE_FILE%';
const connector = {
  id: connectorId,
  parametersValues: {
    AZURE_STORAGE_CONTAINER_BLOB_PREFIX: `${STORAGE_ROOT_DIR_PLACEHOLDER}/${parameterName}/`
  }
};

// TODO move in utility file
function constructFileNameFromDataset (dataset, destinationUploadFile) {
  const fileName = dataset.connector.parametersValues.AZURE_STORAGE_CONTAINER_BLOB_PREFIX.split('/').pop();
  const fullName = destinationUploadFile + fileName;
  return fullName;
}

const ScenarioParameters = ({
  editMode,
  changeEditMode,
  updateAndLaunchScenario,
  launchScenario,
  workspaceId,
  currentScenario,
  scenarioId
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const destinationUploadFile = scenarioId + '/' + parameterName + '/';

  // General states
  const [displayPopup, setDisplayPopup] = useState(false);
  const [fileName, setFileName] = useState('');
  // Current scenario scenarioParameters
  const scenarioParameters = useRef([]);
  const currentDataset = useRef({});

  // Update the scenarioParameters form when scenario scenarioParameters change
  useEffect(() => {
    const parametersValues = currentScenario.data.parametersValues;
    const datasetParam = parametersValues?.find(el => el.parameterId === parameterName);
    const existingDatasetId = datasetParam?.value;

    const fetchDatasetById = async () => {
      const { error, data } = await DatasetService.findDatasetById(ORGANISATION_ID, existingDatasetId);
      if (error) {
        console.error(error);
      }
      currentDataset.current = data;
      setFileName(constructFileNameFromDataset(data, ''));
    };

    if (existingDatasetId) {
      fetchDatasetById();
      setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
    }
    scenarioParameters.current = parametersValues;
  }, [currentScenario, currentDataset, destinationUploadFile]);

  const getValueFromParameters = (parameterId, defaultValue) => {
    if (scenarioParameters.current === null || scenarioParameters === undefined) {
      return defaultValue;
    }
    const param = scenarioParameters.current?.find(element => element.parameterId === parameterId);
    if (param !== undefined) {
      return param.value;
    }
    return defaultValue;
  };

  // TODO extract default value in constant file?
  // State for bar scenarioParameters
  const [stock, setStock] = useState(getValueFromParameters('stock', 100));
  const [restockQuantity, setRestockQuantity] = useState(getValueFromParameters('restock_qty', 25));
  const [waitersNumber, setWaitersNumber] = useState(getValueFromParameters('nb_waiters', 5));

  // State for basic input types examples scenarioParameters
  const [currency, setCurrency] = useState(getValueFromParameters('currency', 'USD'));
  const [currencyName, setCurrencyName] = useState(getValueFromParameters('currency_name', 'EUR'));
  const [currencyValue, setCurrencyValue] = useState(getValueFromParameters('currency_value', 1000));
  const [currencyUsed, setCurrencyUsed] = useState(getValueFromParameters('currency_used', false));
  const [startDate, setStartDate] = useState(getValueFromParameters('start_date', new Date('2014-08-18T21:11:54')));

  // State for File Upload
  const [fileCache, setFileCache] = useState(null);
  const [fileStatus, setFileStatus] = useState(UPLOAD_FILE_STATUS_KEY.EMPTY);

  const resetParameters = () => {
    setStock(getValueFromParameters('stock', 100));
    setRestockQuantity(getValueFromParameters('restock_qty', 25));
    setWaitersNumber(getValueFromParameters('nb_waiters', 5));
    setCurrency(getValueFromParameters('currency', 'USD'));
    setCurrencyName(getValueFromParameters('currency_name', 'EUR'));
    setCurrencyValue(getValueFromParameters('currency_value', 1000));
    setCurrencyUsed(getValueFromParameters('currency_used', false));
    setStartDate(getValueFromParameters('start_date', new Date('2014-08-18T21:11:54')));

    // TODO: Replace these resets with backend calls to get file on server
    setFileCache(null);
  };
  // eslint-disable-next-line
  const getParametersDataForApi = (runTemplateId) => {
    let parametersData = [];
    // Add bar scenarioParameters if necessary (run templates '1' and '2')
    if (['1', '2'].indexOf(runTemplateId) !== -1) {
      parametersData = parametersData.concat([
        {
          parameterId: 'stock',
          varType: 'int',
          value: stock,
          isInherited: stock !== getValueFromParameters('stock')
        },
        {
          parameterId: 'restock_qty',
          varType: 'int',
          value: restockQuantity,
          isInherited: restockQuantity !== getValueFromParameters('restock_qty')
        },
        {
          parameterId: 'nb_waiters',
          varType: 'int',
          value: waitersNumber,
          isInherited: waitersNumber !== getValueFromParameters('nb_waiters')
        }
      ]);
    }

    // Add basic inputs examples scenarioParameters if necessary (run template '4')
    if (['3'].indexOf(runTemplateId) !== -1) {
      parametersData = parametersData.concat([
        {
          parameterId: 'currency',
          varType: 'enum',
          value: currency,
          isInherited: currency !== getValueFromParameters('currency')
        },
        {
          parameterId: 'currency_name',
          varType: 'string',
          value: currencyName,
          isInherited: currencyName !== getValueFromParameters('currency_name')
        },
        {
          parameterId: 'currency_value',
          varType: 'number',
          value: currencyValue,
          isInherited: currencyValue !== getValueFromParameters('currency_value')
        },
        {
          parameterId: 'currency_used',
          varType: 'bool',
          value: currencyUsed,
          isInherited: currencyUsed !== getValueFromParameters('currency_used')
        },
        {
          parameterId: 'start_date',
          varType: 'date',
          value: startDate,
          isInherited: startDate !== getValueFromParameters('start_date')
        }
      ]);
    }

    if (['1', '2', '3', '4'].indexOf(runTemplateId) !== -1) {
      parametersData = parametersData.concat([
        {
          parameterId: parameterName,
          varType: '%DATASETID%',
          value: currentDataset.current
        }
      ]);
    }
    // TODO Add array template scenarioParameters if necessary
    return parametersData;
  };

  // Popup part
  const handleClickOnDiscardChangeButton = () => setDisplayPopup(true);
  const handleClickOnPopupCancelButton = () => setDisplayPopup(false);
  const handleClickOnPopupDiscardChangeButton = () => {
    setDisplayPopup(false);
    changeEditMode(false);
    // Reset form values
    resetParameters();
  };

  // Normal Mode Screen
  const handleClickOnEditButton = () => changeEditMode(true);
  const isCurrentScenarioRunning = () => (currentScenario.data.state === SCENARIO_RUN_STATE.RUNNING);

  const handleClickOnLaunchScenarioButton = () => {
    // If scenario parameters have never been updated, do it now
    if (!currentScenario.data.parametersValues) {
      handleClickOnUpdateAndLaunchScenarioButton();
    } else {
      launchScenario(workspaceId, scenarioId);
      changeEditMode(false);
    }
  };

  const handleClickOnUpdateAndLaunchScenarioButton = async () => {
    if (fileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD) {
      await uploadFile();
      if (currentDataset.current) {
        const fullName = constructFileNameFromDataset(currentDataset.current, destinationUploadFile);
        await deleteFile(fullName);
        const { error, data } = await DatasetService.updateDataset(ORGANISATION_ID, currentDataset.current.id, currentDataset.current);
        if (error) {
          console.error(error);
        } else {
          currentDataset.current = data;
          setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
        }
      } else {
        const { error, data } = await DatasetService.createDataset(ORGANISATION_ID, parameterName, 'Dataset with file', connector);
        if (error) {
          console.error(error);
        } else {
          setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
          currentDataset.current = data;
        }
        const parametersData = getParametersDataForApi(currentScenario.data.runTemplateId);
        updateAndLaunchScenario(workspaceId, scenarioId, parametersData);
        changeEditMode(false);
      }
    } else if (fileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE) {
      const fullName = constructFileNameFromDataset(currentDataset.current, destinationUploadFile);
      await deleteFile(fullName);
      const { error, data } = await DatasetService.deleteDataset(ORGANISATION_ID, currentDataset.current.id);
      if (error) {
        console.error(error);
      } else {
        console.log(data);
        currentDataset.current = {};
        setFileStatus(UPLOAD_FILE_STATUS_KEY.EMPTY);
      }
    }
  };

  // Methods to handle upload file tab
  const handlePrepareToUpload = (event) => {
    const file = event.target.files[0];
    if (file === undefined) {
      return;
    }
    setFileCache(file);
    setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD);
  };

  const uploadFile = async () => {
    setFileStatus(UPLOAD_FILE_STATUS_KEY.UPLOADING);
    const overwrite = true;
    const { error, data } = await WorkspaceService.uploadWorkspaceFile(ORGANISATION_ID, workspaceId, fileCache, overwrite, destinationUploadFile);
    if (error) {
      console.error(error);
    } else {
      console.log(data.fileName);
      currentDataset.current.connector.parametersValues.AZURE_STORAGE_CONTAINER_BLOB_PREFIX = STORAGE_ROOT_DIR_PLACEHOLDER + '/' + data.fileName;
      setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
    }
  };

  const handlePrepareToDeleteFile = () => {
    setFileName('');
    setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE);
    setFileCache(null);
  };

  const deleteFile = async (connectorFilePath) => {
    setFileStatus(UPLOAD_FILE_STATUS_KEY.DELETING);
    const { error, data } = await WorkspaceService.deleteWorkspaceFile(ORGANISATION_ID, workspaceId, connectorFilePath);
    if (error) {
      console.error(error);
    } else {
      console.log(data);
      setFileStatus(UPLOAD_FILE_STATUS_KEY.EMPTY);
    }
  };

  const handleDownloadFile = async () => {
    setFileStatus(UPLOAD_FILE_STATUS_KEY.DOWNLOADING);
    const fileName = constructFileNameFromDataset(currentDataset.current, destinationUploadFile);
    const { error, data } = await WorkspaceService.downloadWorkspaceFile(ORGANISATION_ID, workspaceId, fileName);
    if (error) {
      console.error(error);
    } else {
      console.log(data);
      setFileCache(data);
      fileDownload(data, fileCache.name);
      setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
    }
  };

  /*
  const handleClickOnUpdateAndLaunchScenarioButton = () => {
    const prepareToUpdatePromise = new Promise((resolve, reject) => {
      if (fileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD) {
        uploadFile();
        if (initialStockDataset) {
          console.log('Do da update');
        } else {
          const connector = {
            id: 'C-XPv4LBVGAL',
            parametersValues: {
              AZURE_STORAGE_CONTAINER_BLOB_PREFIX: '%WORKSPACE_FILE%/' + 'initial_stock_dataset/'
            }
          };
          DatasetService.createDataset(ORGANISATION_ID, 'initial_stock_dataset', 'Dataset with file', connector)
            .then(response => {
              const currentDataset = response.data;
              setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
              setInitialStockDataset(currentDataset.id);
              resolve(currentDataset);
            });
        }
      }
    });

    prepareToUpdatePromise
      .then((dataset) => {
        const parametersData = getParametersDataForApi(currentScenario.data.runTemplateId);
        // TODO: FIX THAT UGLY HACK
        parametersData.map(obj => {
          if (obj.parameterId === 'initial_stock_dataset') {
            obj.value = dataset.id;
            obj.isInherited = (dataset.id !== getValueFromParameters('initial_stock_dataset')?.id);
          }
          return obj;
        });
        console.log('!!');
        console.log(parametersData);
        updateAndLaunchScenario(workspaceId, scenarioId, parametersData);
        changeEditMode(false);
      });
  };
*/

  // Edit Mode Screen
  // const handleClickOnUpdateAndLaunchScenarioButton = () => {
  //   // Handle uploading-deleting file
  //   const prepareToUpdatePromise = new Promise((resolve) => {
  //     if (fileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD) {
  //       let currentDataset;
  //       uploadFile();

  //       console.log('1');

  //       if (initialStockDataset) {
  //         console.log('1.1');

  //         deleteFile(initialStockDataset.connector.parametersValues.AZURE_STORAGE_CONTAINER_BLOB_PREFIX);
  //         DatasetService.updateDataset(ORGANISATION_ID, initialStockDataset.id, initialStockDataset).then(result => {
  //           currentDataset = result.data;
  //           // TODO Synchro with uploadFile() then
  //           setInitialStockDataset(currentDataset);
  //           setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
  //         });
  //       } else {
  //         console.log('1.2');

  //         const connector = {
  //           id: 'C-XPv4LBVGAL',
  //           paramatersValues: {
  //             AZURE_STORAGE_CONTAINER_BLOB_PREFIX: '%WORKSPACE_FILE%/' + fileCache.name
  //           }
  //         };
  //         DatasetService.createDataset(ORGANISATION_ID, 'datasetWithFile', 'Dataset with file', connector).then(result => {
  //           currentDataset = result.data;
  //           console.log('@@@@@@@@@@@@@@@@@@@@@@');
  //           console.log(currentDataset.tags);
  //           console.log('@@@@@@@@@@@@@@@@@@@@@@');
  //           // TODO Synchro with uploadFile() then
  //           setInitialStockDataset(currentDataset);
  //           setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
  //         });
  //       }
  //     } else if (fileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE && initialStockDataset) {
  //       DatasetService.deleteDataset(ORGANISATION_ID, workspaceId, initialStockDataset.id);
  //       deleteFile(initialStockDataset.connector.parametersValues.AZURE_STORAGE_CONTAINER_BLOB_PREFIX);
  //       setFileStatus(UPLOAD_FILE_STATUS_KEY.IDLE);
  //     }
  //   });

  //   // See https://github.com/jreynard-code/cosmotech-api-javascript-client/blob/master/docs/ScenarioApi.md#addorreplacescenarioparametervalues
  //   prepareToUpdatePromise.then(result => {
  //     const parametersData = getParametersDataForApi(
  //       currentScenario.data.runTemplateId);
  //     console.log('§§§§§§§§§§§§§§§');
  //     console.log(parametersData);
  //     console.log('§§§§§§§§§§§§§§§');
  //     updateAndLaunchScenario(workspaceId, scenarioId, parametersData);
  //     changeEditMode(false);
  //   }).catch(error => {
  //     console.log('ERROR ');
  //     console.log(error);
  //   });
  // };

  // Indices in this array must match indices in the tabs configuration file
  // configs/ScenarioParametersTabs.config.js
  const scenarioParametersTabs = [
    <FileUpload key="0"
      fileName={fileName}
      fileCache={fileCache}
      fileStatus={fileStatus}
      acceptedFileTypesToUpload={acceptedFileTypesToUpload}
      handleUploadFile={handlePrepareToUpload}
      handleDeleteFile={handlePrepareToDeleteFile}
      handleDownloadFile={handleDownloadFile}
      editMode={editMode}
    />,
    <BarParameters key="1"
      stock={stock}
      changeStock={setStock}
      restockQuantity={restockQuantity}
      changeRestockQuantity={setRestockQuantity}
      waitersNumber={waitersNumber}
      changeWaitersNumber={setWaitersNumber}
      editMode={editMode}
    />,
    <BasicTypes key="2"
      textFieldValue={currencyName}
      changeTextField={setCurrencyName}
      numberFieldValue={currencyValue}
      changeNumberField={setCurrencyValue}
      enumFieldValue={currency}
      changeEnumField={setCurrency}
      switchFieldValue={currencyUsed}
      changeSwitchType={setCurrencyUsed}
      selectedDate={startDate}
      changeSelectedDate={setStartDate}
      editMode={editMode}
    />,
    <Typography key="3">Empty</Typography> // Array template
  ];

  // Disable edit button if no tabs are shown
  let tabsShown = false;
  for (const tab of SCENARIO_PARAMETERS_TABS_CONFIG) {
    if (tab.runTemplateIds.indexOf(currentScenario.data.runTemplateId) !== -1) {
      tabsShown = true;
      break;
    }
  }

  return (
      <div>
        <Grid container direction="column" justify="center" alignContent="flex-start" >
          <Grid container className={classes.root} direction="row" justify="space-between" alignContent="flex-start" spacing={5}>
            <Grid item >
              <Typography variant='subtitle1'>
                { t('genericcomponent.text.scenario.parameters.title', 'Scenario parameters') }

              </Typography>
            </Grid>
            <Grid item >
              { editMode
                ? (<EditModeButton classes={classes}
                  handleClickOnDiscardChange={handleClickOnDiscardChangeButton}
                  handleClickOnUpdateAndLaunchScenario={handleClickOnUpdateAndLaunchScenarioButton}/>)
                : (<NormalModeButton classes={classes}
                  handleClickOnEdit={handleClickOnEditButton}
                  handleClickOnLaunchScenario={handleClickOnLaunchScenarioButton}
                  editDisabled={!tabsShown || isCurrentScenarioRunning()}
                  runDisabled={isCurrentScenarioRunning()}/>)
              }
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.tabs}>
          {
            <form>
              <ScenarioParametersTabs
                tabs={scenarioParametersTabs}
                currentScenario={currentScenario}
              />
            </form>
          }
        </Grid>
        <SimpleTwoActionsDialog
            open={displayPopup}
            dialogTitleKey='genericcomponent.dialog.scenario.parameters.title'
            dialogBodyKey='genericcomponent.dialog.scenario.parameters.body'
            cancelLabelKey='genericcomponent.dialog.scenario.parameters.button.cancel'
            validateLabelKey='genericcomponent.dialog.scenario.parameters.button.validate'
            handleClickOnCancel={handleClickOnPopupCancelButton}
            handleClickOnValidate={handleClickOnPopupDiscardChangeButton}
          />
      </div>
  );
};

ScenarioParameters.propTypes = {
  editMode: PropTypes.bool.isRequired,
  changeEditMode: PropTypes.func.isRequired,
  updateAndLaunchScenario: PropTypes.func.isRequired,
  launchScenario: PropTypes.func.isRequired,
  workspaceId: PropTypes.string.isRequired,
  scenarioId: PropTypes.string.isRequired,
  currentScenario: PropTypes.object.isRequired
};

export default ScenarioParameters;
