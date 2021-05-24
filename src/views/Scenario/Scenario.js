// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card } from '@material-ui/core';
import HierarchicalComboBox from '../../components/HierarchicalComboBox';
import { ScenarioParameters } from '../../components';
import { useTranslation } from 'react-i18next';
import { CreateScenarioButton } from '../../components/CreateScenarioDialog';
import { Dashboard } from '@cosmotech/ui';
import { SCENARIO_DASHBOARD_CONFIG } from '../../configs/ScenarioDashboard.config';

const useStyles = theme => ({
  root: {
    height: '100%'
  },
  scenarioPanel: {
    height: '100%',
    flexGrow: 1,
    paddingRight: '4px',
    display: 'flex',
    flexDirection: 'column',
    margin: '4px'
  },
  scenarioList: {
    paddingRight: '20px'
  },
  mainGrid: {
    display: 'flex',
    flexGrow: 1,
    paddingLeft: '2px',
    paddingTop: '6px',
    paddingRight: '2px',
    paddingBottom: '6px'
  },
  grid: {
    flexGrow: 1,
    height: '100%'
  }
});

const Scenario = (props) => {
  const { t } = useTranslation();

  const {
    currentScenario,
    // eslint-disable-next-line no-unused-vars
    scenarioList,
    findScenarioById,
    scenarioTree,
    datasetList,
    runTemplateList,
    user,
    workspace,
    solution,
    createScenario,
    classes,
    updateAndLaunchScenario
  } = props;

  const formattedUrl = SCENARIO_DASHBOARD_CONFIG.url.replaceAll('<ScenarioName>', currentScenario.data.name);

  const workspaceId = workspace.data.id;
  const [editMode, setEditMode] = useState(false);

  function handleScenarioChange (event, scenario) {
    findScenarioById(workspaceId, scenario.id);
  }

  return (
    <Grid container direction="column" className={classes.mainGrid}>
      <Grid item xs={12}>
        <Grid container alignItems="center" className={classes.mainGrid}>
          <Grid item xs={9}>
            <Grid container spacing={0} alignItems="center" className={props.classes.mainGrid}>
              <Grid item xs={5} className={props.classes.scenarioList}>
                <HierarchicalComboBox
                  value={currentScenario.data}
                  maxCharLength={36}
                  tree={scenarioTree.data}
                  label='views.scenario.dropdown.scenario.label'
                  handleChange={handleScenarioChange}
                />
              </Grid>
              { currentScenario.data &&
                (<Grid item xs={7}>
                  <Typography>{ t('views.scenario.text.scenariotype')}: { currentScenario.data.runTemplateName}</Typography>
                </Grid>)
              }
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid container spacing={2} justify="flex-end" className={props.classes.mainGrid}>
              <Grid item>
                <CreateScenarioButton
                  solution={solution}
                  workspaceId={workspaceId}
                  createScenario={createScenario}
                  currentScenario={currentScenario}
                  runTemplates={runTemplateList.data}
                  datasets={datasetList.data}
                  scenarios={scenarioTree.data}
                  user={user}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Card style={{ height: '400px' }}>
          <Dashboard
            iframeTitle={t('commoncomponents.iframe.scenario.results.card.title', 'Results')}
            url={formattedUrl}
            scenarioName={currentScenario.data.name}
          />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <ScenarioParameters
            editMode={editMode}
            changeEditMode={setEditMode}
            updateAndLaunchScenario={updateAndLaunchScenario}
            workspaceId={workspaceId}
            currentScenario={currentScenario}
            scenarioId={currentScenario.data.id}/>
        </Card>
      </Grid>
    </Grid>
  );
};

Scenario.propTypes = {
  classes: PropTypes.any,
  scenarioTree: PropTypes.object.isRequired,
  scenarioList: PropTypes.object.isRequired,
  datasetList: PropTypes.object.isRequired,
  runTemplateList: PropTypes.object.isRequired,
  currentScenario: PropTypes.object.isRequired,
  findScenarioById: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  workspace: PropTypes.object.isRequired,
  solution: PropTypes.object.isRequired,
  createScenario: PropTypes.func.isRequired,
  updateAndLaunchScenario: PropTypes.func.isRequired
};

export default withStyles(useStyles)(Scenario);
