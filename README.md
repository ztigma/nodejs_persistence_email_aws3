# nodejs_persistence_email_aws3

GET_PERSISTENCE;
SELECT_PERSISTENCE;
FIND_PERSISTENCE;
REMOVE_PERSISTENCE;
ADD_PERSISTENCE;
SET_PERSISTENCE;
LOAD;
SAVE;
LOAD_BINARY;
SAVE_BINARY;

ASYNC_GET_PERSISTENCE;
ASYNC_SELECT_PERSISTENCE;
ASYNC_FIND_PERSISTENCE;
ASYNC_REMOVE_PERSISTENCE;
ASYNC_ADD_PERSISTENCE;
ASYNC_SET_PERSISTENCE;
ASYNC_LOAD;
ASYNC_SAVE;
ASYNC_LOAD_BINARY;
ASYNC_SAVE_BINARY;

GET_PERSISTENCE_AWS3;
SELECT_PERSISTENCE_AWS3;
FIND_PERSISTENCE_AWS3;
REMOVE_PERSISTENCE_AWS3;
ADD_PERSISTENCE_AWS3;
SET_PERSISTENCE_AWS3;
LOAD_AWS3;
SAVE_AWS3;
LOAD_BINARY_AWS3;
SAVE_BINARY_AWS3;


example of use:
require('./async');

'db/users.json'.GET_PERSISTENCE_AWS3
(
  function(data)
  {
    
  }
)

let data = await 'db/users.json'.ASYNC_GET_PERSISTENCE();
