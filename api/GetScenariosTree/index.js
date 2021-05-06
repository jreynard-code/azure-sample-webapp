// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
const responseTemplate = require('./GetScenariosTree.json');

// TODO remove the mock response and use the ScenarioAPI when it's ready
module.exports = async function (context, req) {
  // eslint-disable-next-line no-unused-vars
  const workspaceId = (req.query.workspaceId || (req.body && req.body.workspaceId));
  context.log('GetScenariosTree HTTP trigger function. WorkspaceId: ' + workspaceId);
  context.res = {
    body: responseTemplate
  };
};