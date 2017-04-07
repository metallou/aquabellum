let tmp;
let param1;
let param2;

function statusExpected(success, msg)
{
  if(!success) {
    console.error("fail");
  } else {
    //console.info(msg);
  }
}

function testCheckdef(param1, success)
{
  console.log("Check.def("+param1+")");
  try {
    tmp = Check.def(param1);
    statusExpected(success, "ok");
  } catch(error) {
    statusExpected(!success, error);
  }
}
function testChecklist(param1, param2, success)
{
  console.log("Check.list("+param1+", "+param2+")");
  try {
    tmp = Check.list(param1, param2);
    statusExpected(success, "ok");
  } catch(error) {
    statusExpected(!success, error);
  }
}
function testCheckproto(param1, param2, success)
{
  console.log("Check.proto("+param1+", "+param2+")");
  try {
    tmp = Check.proto(param1, param2);
    statusExpected(success, "ok");
  } catch(error) {
    statusExpected(!success, error);
  }
}
function testChecksup(param1, param2, success)
{
  console.log("Check.sup("+param1+", "+param2+")");
  try {
    tmp = Check.sup(param1, param2);
    statusExpected(success, "ok");
  } catch(error) {
    statusExpected(!success, error);
  }
}
function testCheckinf(param1, param2, success)
{
  console.log("Check.inf("+param1+", "+param2+")");
  try {
    tmp = Check.inf(param1, param2);
    statusExpected(success, "ok");
  } catch(error) {
    statusExpected(!success, error);
  }
}
function testCheckesup(param1, param2, success)
{
  console.log("Check.esup("+param1+", "+param2+")");
  try {
    tmp = Check.esup(param1, param2);
    statusExpected(success, "ok");
  } catch(error) {
    statusExpected(!success, error);
  }
}
function testCheckeinf(param1, param2, success)
{
  console.log("Check.einf("+param1+", "+param2+")");
  try {
    tmp = Check.einf(param1, param2);
    statusExpected(success, "ok");
  } catch(error) {
    statusExpected(!success, error);
  }
}
function testCheckeq(param1, param2, success)
{
  console.log("Check.eq("+param1+", "+param2+")");
  try {
    tmp = Check.eq(param1, param2);
    statusExpected(success, "ok");
  } catch(error) {
    statusExpected(!success, error);
  }
}
function testCheckneq(param1, param2, success)
{
  console.log("Check.neq("+param1+", "+param2+")");
  try {
    tmp = Check.neq(param1, param2);
    statusExpected(success, "ok");
  } catch(error) {
    statusExpected(!success, error);
  }
}

console.log("\n");
console.log("Check.def");
testCheckdef( undefined,     false);
testCheckdef( null,          false);
testCheckdef( [],            true);
testCheckdef( {},            true);
testCheckdef( function(){},  true);
testCheckdef( "coucou",      true);
testCheckdef( 42,            true);
testCheckdef( true,          true);

console.log("\n");
console.log("Check.list");
testChecklist(  undefined,      undefined,      false);
testChecklist(  null,           undefined,      false);
testChecklist(  [],             undefined,      false);
testChecklist(  {},             undefined,      false);
testChecklist(  function(){},   undefined,      false);
testChecklist(  "coucou",       undefined,      false);
testChecklist(  42,             undefined,      false);
testChecklist(  true,           undefined,      false);
testChecklist(  types,          undefined,      false);
testChecklist(  types,          null,           false);
testChecklist(  types,          [],             false);
testChecklist(  types,          {},             false);
testChecklist(  types,          function(){},   false);
testChecklist(  types,          "coucou",       false);
testChecklist(  types,          42,             false);
testChecklist(  types,          true,           false);
testChecklist(  types,          "Boolean",      true);
testChecklist(  types,          "Number",       true);
testChecklist(  types,          "String",       true);
testChecklist(  types,          "Array",        true);
testChecklist(  types,          "Object",       true);
testChecklist(  types,          "Function",     true);

console.log("\n");
console.log("Check.proto");
testCheckproto(undefined,     undefined,      false);
testCheckproto(undefined,     null,           false);
testCheckproto(undefined,     [],             false);
testCheckproto(undefined,     {},             false);
testCheckproto(undefined,     function(){},   false);
testCheckproto(undefined,     "coucou",       false);
testCheckproto(undefined,     42,             false);
testCheckproto(undefined,     true,           false);
testCheckproto(undefined,     "Boolean",      false);
testCheckproto(null,          "Boolean",      false);
testCheckproto([],            "Boolean",      false);
testCheckproto({},            "Boolean",      false);
testCheckproto(function(){},  "Boolean",      false);
testCheckproto("coucou",      "Boolean",      false);
testCheckproto(42,            "Boolean",      false);
testCheckproto(true,          "Boolean",      true);
testCheckproto(undefined,     "Number",       false);
testCheckproto(null,          "Number",       false);
testCheckproto([],            "Number",       false);
testCheckproto({},            "Number",       false);
testCheckproto(function(){},  "Number",       false);
testCheckproto("coucou",      "Number",       false);
testCheckproto(42,            "Number",       true);
testCheckproto(true,          "Number",       false);
testCheckproto(undefined,     "String",       false);
testCheckproto(null,          "String",       false);
testCheckproto([],            "String",       false);
testCheckproto({},            "String",       false);
testCheckproto(function(){},  "String",       false);
testCheckproto("coucou",      "String",       true);
testCheckproto(42,            "String",       false);
testCheckproto(true,          "String",       false);
testCheckproto(undefined,     "Array",        false);
testCheckproto(null,          "Array",        false);
testCheckproto([],            "Array",        true);
testCheckproto({},            "Array",        false);
testCheckproto(function(){},  "Array",        false);
testCheckproto("coucou",      "Array",        false);
testCheckproto(42,            "Array",        false);
testCheckproto(true,          "Array",        false);
testCheckproto(undefined,     "Object",       false);
testCheckproto(null,          "Object",       false);
testCheckproto([],            "Object",       false);
testCheckproto({},            "Object",       true);
testCheckproto(function(){},  "Object",       false);
testCheckproto("coucou",      "Object",       false);
testCheckproto(42,            "Object",       false);
testCheckproto(true,          "Object",       false);
testCheckproto(undefined,     "Function",     false);
testCheckproto(null,          "Function",     false);
testCheckproto([],            "Function",     false);
testCheckproto({},            "Function",     false);
testCheckproto(function(){},  "Function",     true);
testCheckproto("coucou",      "Function",     false);
testCheckproto(42,            "Function",     false);
testCheckproto(true,          "Function",     false);

console.log("\n");
console.log("Check.sup");
testChecksup(undefined,     undefined,      false);
testChecksup(null,          undefined,      false);
testChecksup([],            undefined,      false);
testChecksup({},            undefined,      false);
testChecksup(function(){},  undefined,      false);
testChecksup("coucou",      undefined,      false);
testChecksup(42,            undefined,      false);
testChecksup(true,          undefined,      false);
testChecksup(42,            null,           false);
testChecksup(42,            [],             false);
testChecksup(42,            {},             false);
testChecksup(42,            function(){},   false);
testChecksup(42,            "coucou",       false);
testChecksup(42,            42,             true);
testChecksup(42,            true,           false);
testChecksup(42,            43,             false);
testChecksup(42,            41,             true);

console.log("\n");
console.log("Check.inf");
testCheckinf(undefined,     undefined,      false);
testCheckinf(null,          undefined,      false);
testCheckinf([],            undefined,      false);
testCheckinf({},            undefined,      false);
testCheckinf(function(){},  undefined,      false);
testCheckinf("coucou",      undefined,      false);
testCheckinf(42,            undefined,      false);
testCheckinf(true,          undefined,      false);
testCheckinf(42,            null,           false);
testCheckinf(42,            [],             false);
testCheckinf(42,            {},             false);
testCheckinf(42,            function(){},   false);
testCheckinf(42,            "coucou",       false);
testCheckinf(42,            42,             true);
testCheckinf(42,            true,           false);
testCheckinf(42,            43,             true);
testCheckinf(42,            41,             false);

console.log("\n");
console.log("Check.esup");
testCheckesup(undefined,     undefined,      false);
testCheckesup(null,          undefined,      false);
testCheckesup([],            undefined,      false);
testCheckesup({},            undefined,      false);
testCheckesup(function(){},  undefined,      false);
testCheckesup("coucou",      undefined,      false);
testCheckesup(42,            undefined,      false);
testCheckesup(true,          undefined,      false);
testCheckesup(42,            null,           false);
testCheckesup(42,            [],             false);
testCheckesup(42,            {},             false);
testCheckesup(42,            function(){},   false);
testCheckesup(42,            "coucou",       false);
testCheckesup(42,            42,             false);
testCheckesup(42,            true,           false);
testCheckesup(42,            43,             false);
testCheckesup(42,            41,             true);

console.log("\n");
console.log("Check.einf");
testCheckeinf(undefined,     undefined,      false);
testCheckeinf(null,          undefined,      false);
testCheckeinf([],            undefined,      false);
testCheckeinf({},            undefined,      false);
testCheckeinf(function(){},  undefined,      false);
testCheckeinf("coucou",      undefined,      false);
testCheckeinf(42,            undefined,      false);
testCheckeinf(true,          undefined,      false);
testCheckeinf(42,            null,           false);
testCheckeinf(42,            [],             false);
testCheckeinf(42,            {},             false);
testCheckeinf(42,            function(){},   false);
testCheckeinf(42,            "coucou",       false);
testCheckeinf(42,            42,             false);
testCheckeinf(42,            true,           false);
testCheckeinf(42,            43,             true);
testCheckeinf(42,            41,             false);

console.log("\n");
console.log("Check.eq");
testCheckeq(undefined,     undefined,      false);
testCheckeq(null,          undefined,      false);
testCheckeq([],            undefined,      false);
testCheckeq({},            undefined,      false);
testCheckeq(function(){},  undefined,      false);
testCheckeq("coucou",      undefined,      false);
testCheckeq(42,            undefined,      false);
testCheckeq(true,          undefined,      false);
testCheckeq(42,            null,           false);
testCheckeq(42,            [],             false);
testCheckeq(42,            {},             false);
testCheckeq(42,            function(){},   false);
testCheckeq(42,            "coucou",       false);
testCheckeq(42,            42,             true);
testCheckeq(42,            true,           false);
testCheckeq(42,            43,             false);
testCheckeq(42,            41,             false);

console.log("\n");
console.log("Check.neq");
testCheckneq(undefined,     undefined,      false);
testCheckneq(null,          undefined,      false);
testCheckneq([],            undefined,      false);
testCheckneq({},            undefined,      false);
testCheckneq(function(){},  undefined,      false);
testCheckneq("coucou",      undefined,      false);
testCheckneq(42,            undefined,      false);
testCheckneq(true,          undefined,      false);
testCheckneq(42,            null,           false);
testCheckneq(42,            [],             false);
testCheckneq(42,            {},             false);
testCheckneq(42,            function(){},   false);
testCheckneq(42,            "coucou",       false);
testCheckneq(42,            42,             false);
testCheckneq(42,            true,           false);
testCheckneq(42,            43,             true);
testCheckneq(42,            41,             true);


