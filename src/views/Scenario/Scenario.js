// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Card, Grid } from '@material-ui/core';
import { IframeScenarioResults } from '../../components';
import { useTranslation } from 'react-i18next';
import { ScenarioParameters } from '../../components/ScenarioParameters';

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
  mainGrid: {
    display: 'flex',
    flexGrow: 1,
    padding: '10px'
  },
  grid: {
    flexGrow: 1,
    height: '100%'
  }
});

const Scenario = ({
  classes,
  scenarioList,
  scenarioTree,
  currentScenario
}) => {
  const { t } = useTranslation();

  const [editMode, setEditMode] = useState(false);

  return (
  // <Grid container spacing={2} direction="column" className={classes.mainGrid}>
  //   <Grid item xs={12} style={{ backgroundColor: '#54E035' }}>
  //     <Typography>DASHBOARD</Typography>
  //   </Grid>
  //   <Grid item xs={12} style={{ backgroundColor: '#67D100' }}>
  //   <Typography>SCENARIO PARAMETERS</Typography>
  //   </Grid>
  // </Grid>

    <Grid container direction="column" className={classes.mainGrid}>
      {/* <Grid item xs={12}>
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
                <CreateScenarioButton currentScenario={currentScenario} runTemplates={runTemplateList.data} datasets={datasetList.data} scenarios={scenarioTree.data} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid> */}
      <Grid item xs={12}>
        {/* <Dashboard
          iframeTitle="Dashboard"
          url="https://app.powerbi.com/reportEmbed?reportId=018525c4-3fed-49e7-9048-6d6237e80145&autoAuth=true&ctid=e9641c78-d0d6-4d09-af63-168922724e7f&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLWZyYW5jZS1jZW50cmFsLWEtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D"
        /> */}
        <Card style={{ height: '400px' }}>
          <IframeScenarioResults
            cardStyle={ { height: '100%', width: '100%' } }
            iframeTitle={t('commoncomponents.iframe.scenario.results.iframe.title', 'Supply Chain results')}
            cardTitle={t('commoncomponents.iframe.scenario.results.card.title', 'Results')}
            src="https://app.powerbi.com/reportEmbed?reportId=018525c4-3fed-49e7-9048-6d6237e80145&autoAuth=true&ctid=e9641c78-d0d6-4d09-af63-168922724e7f&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLWZyYW5jZS1jZW50cmFsLWEtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D"
            frameBorder="0"
            allowFullScreen
          />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <ScenarioParameters editMode={editMode} changeEditMode={setEditMode}/>
        </Card>
      </Grid>
    </Grid>

  // <Box component='main' display='flex' flexDirection='column'
  //     className={classes.root}>
  //   <Box className={classes.scenarioPanel}>
  //     <Grid container spacing={2} className={classes.mainGrid}>
  //       <Grid item xs={9}>
  //         <IframeScenarioResults
  //         cardStyle={ { height: '100%', width: '100%' } }
  //         iframeTitle={t('commoncomponents.iframe.scenario.results.iframe.title', 'Supply Chain results')}
  //         cardTitle={t('commoncomponents.iframe.scenario.results.card.title', 'Results')}
  //         src="https://app.powerbi.com/reportEmbed?reportId=018525c4-3fed-49e7-9048-6d6237e80145&autoAuth=true&ctid=e9641c78-d0d6-4d09-af63-168922724e7f&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLWZyYW5jZS1jZW50cmFsLWEtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D"
  //         frameBorder="0"
  //         allowFullScreen
  //         />
  //       </Grid>
  //       <ScenarioParameters/>
  //     </Grid>
  //   </Box>
  // </Box>
  );
};

Scenario.propTypes = {
  classes: PropTypes.any,
  scenarioList: PropTypes.object.isRequired,
  scenarioTree: PropTypes.object.isRequired,
  currentScenario: PropTypes.object
};

export default withStyles(useStyles)(Scenario);
