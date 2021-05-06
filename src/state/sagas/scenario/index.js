// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, fork } from 'redux-saga/effects';
import { findAllScenariosData } from './FindAllScenarios';
import { getScenariosTreeData } from './GetScenariosTree';
import { getScenarioByIdData } from './FindScenarioById';
import { addNewScenarioData } from './AddNewScenario';

export default function * scenarioSaga () {
  yield all([
    fork(findAllScenariosData),
    fork(getScenariosTreeData),
    fork(getScenarioByIdData),
    fork(addNewScenarioData)
  ]);
}