'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { User } from '../../models/tigris/users';
import Each from './each';
import LoaderWave from '../components/LoaderWave';
import Menu from '../components/Menu';
import validator from "@rjsf/validator-ajv8";
import { RJSFSchema } from "@rjsf/utils";
import Form from "@rjsf/core";
const Home = () => {
  // This is the input field
  const [textInput, setTextInput] = useState('');

  // List array which displays the users
  const [usersList, setList] = useState<User[]>([]);

  // Loading and Error flags for the template
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // This is use to animate the input text field
  const [wiggleError, setWiggleError] = useState(false);

  // Two separate views. 1. List view for todo users & 2. Search result view
  type viewModeType = 'list' | 'search';
  const [viewMode, setViewMode] = useState<viewModeType>('list');

  // Fetch List
  /*
   'fetchListUsers' is the first method that's called when the component is mounted from the useEffect below.
   This sets some of the state like 'isLoading' and 'isError' before it fetches for data from the endpoint defined under 'pages/api/users/index'.
   The api endpoint returns a json with the key 'result' and a status 200 if successful or returns a status 500 along with the 'error' key.
   If the 'result' key is present we safely set the 'usersList'.
  */
  const fetchListUsers = () => {
    setIsLoading(true);
    setIsError(false);

    fetch('/api/users?limit=10')
      .then(response => response.json())
      .then(data => {
        setIsLoading(false);
        if (data.result) {
          setViewMode('list');
          setList(data.result);
        } else {
          setIsError(true);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  };

  // Load the initial list of users
  useEffect(() => {
    fetchListUsers();
  }, []);

  // Add a new user
  /*
  'addUser' takes the 'textInput' state, creates a 'User' & converts it to a JSON.
  Sends it over as body payload to the api endpoint; which is how the api expects and is defined in 'pages/api/users' 'POST' switch.
  */
  const addUser = (data: any) => {
    setIsLoading(true);

    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(() => {
      setIsLoading(false);
      fetchListUsers();
    });
  };

  // Delete user
  /*
  'deleteUser' requires an id value of the User. When the user presses the 'delete'(cross) button from a User, this method is invoked.
  It calls the endpoint 'api/user/<id>' with the 'DELETE' method. Read the method 'handleDelete' under pages/api/user/[id]' to learn more how the api handles deletion.
  */
  const deleteUser = (id?: User["id"]) => {
    setIsLoading(true);

    fetch('/api/user/' + id, {
      method: 'DELETE'
    }).then(() => {
      setIsLoading(false);
      if (viewMode == 'list') {
        fetchListUsers();
      } else {
        searchQuery();
      }
    });
  };

  // Update user (mark complete/incomplete)
  /*
  'updateUser' takes the User object, inverts the 'completed' boolean and calls the same endpoint as 'deletion' but with a different method 'PUT'.
  Navigate to 'api/user/[id]' and read more how the api handles updates under the 'handlePut' method.
  */
  const updateUser = (user: User) => {
    setIsLoading(true);

    fetch('/api/user/' + user.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }).then(() => {
      setIsLoading(false);
      if (viewMode == 'list') {
        fetchListUsers();
      } else {
        searchQuery();
      }
    });
  };

  // Search query
  /*
  'searchQuery' method takes the state from 'textInput' and send it over to the 'api/users/search' endpoint via a query param 'q'.
  The response is the same as the response from "fetch('/api/users')", an array of Users if successful.
  */
  const searchQuery = () => {
    if (queryCheckWiggle()) {
      return;
    }
    setIsLoading(true);

    fetch(`/api/users/search?q=${encodeURI(textInput)}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        setIsLoading(false);
        if (data.result) {
          setViewMode('search');
          setList(data.result);
        }
      });
  };

  // Util search query/input check
  /*
  The is a helper util method, that validates the input field via a regex and returns a true or false.
  This also wiggles the text input if the regex doesn't find any match.
  */
  const queryCheckWiggle = () => {
    const result: RegExpMatchArray | null = textInput.match('^\\S.{0,100}$');
    if (result === null) {
      setWiggleError(true);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!wiggleError) {
      return;
    }
    const timeOut = setTimeout(() => {
      setWiggleError(false);
    }, 500);

    return () => clearTimeout(timeOut);
  }, [wiggleError]);

  return (
    <div>
      <div className="container">
        <h2>test_nextjs using Next.js 13 and Tigris</h2>

        <Menu />

        {/* Search Header */}
        <div className="searchHeader">
          <input
            className={`searchInput ${wiggleError ? 'invalid' : ''}`}
            value={textInput}
            onChange={e => {
              setWiggleError(false);
              setTextInput(e.target.value);
            }}
            placeholder="Type an User to add or search"
          />
          <button onClick={searchQuery}>Search</button>
        </div>

        {/* Results section */}
        <div className="results">
          {/* Loader, Errors and Back to List mode */}
          {isError && <p className="errorText">Something went wrong.. </p>}
          {isLoading && <LoaderWave />}
          {viewMode == 'search' && (
            <button
              className="clearSearch"
              onClick={() => {
                setTextInput('');
                fetchListUsers();
              }}
            >
              Go back to list
            </button>
          )}

          {/* User List */}
          {usersList.length < 1 ? (
            <p className="noUsers">
              {viewMode == 'search' ? 'No users found.. ' : 'Add an user by typing in the field above and hit Add!'}
            </p>
          ) : (
            <ul>
              {usersList.map(each => {
                return (
                  <Each
                    key={each.id}
                    user={each}
                    deleteHandler={deleteUser}
                    updateHandler={updateUser}
                  />
                );
              })}
            </ul>
          )}
        </div>
        <div>
          <Form schema={JSON.parse(`{
    "title": "users",
    "description": "Collection of documents with details of users",
    "properties": {
        "id": {
            "description": "A unique identifier for the user",
            "type": "integer",
            "autoGenerate": true
        },
        "name": {
            "description": "Name of the user",
            "type": "string",
            "maxLength": 100
        },
        "balance": {
            "description": "User account balance",
            "type": "number"
        },
        "languages": {
            "description": "Languages spoken by the user",
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "address": {
            "description": "Street address of the user",
            "type": "object",
            "properties": {
                "street": {
                    "description": "Street number",
                    "type": "string"
                },
                "city": {
                    "description": "Name of the city",
                    "type": "string"
                },
                "state": {
                    "description": "Name of the state",
                    "type": "string"
                },
                "zip": {
                    "description": "The zip code",
                    "type": "integer"
                }
            }
        }
    },
    "primary_key": ["id"],
    "required": ["name"]}
`)} validator={validator}
                onSubmit={(event) => addUser(event.formData)} />
        </div>
        <a href="https://tigrisdata.com/">
          <Image src="/tigris_logo.svg" alt="Tigris Logo" width={100} height={100} />
        </a>
      </div>
    </div>
  );
};

export default Home;
