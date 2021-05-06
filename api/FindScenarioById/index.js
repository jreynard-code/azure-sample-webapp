// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const scenario1 = require('./Scenario1.json');
const scenario2 = require('./Scenario2.json');
const scenario3 = require('./Scenario3.json');

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  const id = (req.query.id || (req.body && req.body.id));

  let body;
  switch (id) {
    case '1':
      body = scenario1;
      break;
    case '2':
      body = scenario2;
      break;
    case '3':
      body = scenario3;
  }
  console.log(id);
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: body
  };
};