// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import 'cypress-file-upload';
import utils from '../../commons/TestUtils';

import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { Downloads, Login, Scenarios, ScenarioManager, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

const SCENARIO_DATASET = DATASET.BREWERY_ADT;
const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;
const CSV_INVALID_FILE_PATH = 'customers_invalid.csv';
const XLSX_INVALID_FILE_PATH = 'customers_invalid.xlsx';

function forgeScenarioName() {
  const prefix = 'Scenario with table - ';
  return `${prefix}${utils.randomStr(7)}`;
}

function checkErrorsPanelFromList(errors) {
  const errorsCount = errors.length;
  BreweryParameters.getCustomersErrorsPanel().should('be.visible');
  BreweryParameters.getCustomersErrorsHeader().should('have.text', `File load failed. ${errorsCount} errors occurred:`);
  BreweryParameters.getCustomersErrorsAccordions().should('have.length', errorsCount);
  errors.forEach((error, index) => {
    if (error.summary) {
      BreweryParameters.getCustomersErrorSummary(index).should('have.text', error.summary);
    }
    if (error.loc) {
      BreweryParameters.getCustomersErrorLoc(index).should('have.text', error.loc);
    }
  });
}

describe('Table parameters standard operations', () => {
  before(() => {
    Login.login();
  });

  beforeEach(() => {
    Login.relogin();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    Downloads.clearDownloadsFolder();
    // Delete all tests scenarios
    ScenarioManager.switchToScenarioManager();
    for (const scenarioName of scenarioNamesToDelete) {
      ScenarioManager.deleteScenario(scenarioName);
    }
  });

  it('can import invalid files and display the errors panel', () => {
    const checkErrorsPanel = () => {
      const expectedErrors = [
        { summary: 'Missing columns', loc: 'Line 1' },
        { summary: 'Incorrect int value', loc: 'Line 2 , Column 1 ("age")' },
        { summary: 'Incorrect bool value' },
        { summary: 'Incorrect enum value' },
        { summary: 'Incorrect date value' },
        { summary: 'Incorrect number value' },
        { summary: 'Incorrect int value' },
        { summary: 'Incorrect bool value' },
        { summary: 'Incorrect enum value' },
        { summary: 'Incorrect date value' },
        { summary: 'Incorrect number value' },
      ];
      checkErrorsPanelFromList(expectedErrors);
    };

    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersImportButton().should('be.visible');
    BreweryParameters.getCustomersCSVExportButton().should('be.visible');
    BreweryParameters.getCustomersErrorsPanel().should('not.exist');
    ScenarioParameters.edit();
    BreweryParameters.importCustomersTableData(CSV_INVALID_FILE_PATH);
    checkErrorsPanel();
    BreweryParameters.importCustomersTableData(XLSX_INVALID_FILE_PATH);
    checkErrorsPanel();
    ScenarioParameters.discard();
    BreweryParameters.getCustomersErrorsPanel().should('not.exist');
  });
});
