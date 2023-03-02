'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Product } from '../../models/tigris/products';
import Each from './each';
import LoaderWave from '../components/LoaderWave';
import Menu from '../components/Menu';
import validator from "@rjsf/validator-ajv8";
import { RJSFSchema } from "@rjsf/utils";
import Form from "@rjsf/core";
const Home = () => {
  // This is the input field
  const [textInput, setTextInput] = useState('');

  // List array which displays the products
  const [productsList, setList] = useState<Product[]>([]);

  // Loading and Error flags for the template
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // This is use to animate the input text field
  const [wiggleError, setWiggleError] = useState(false);

  // Two separate views. 1. List view for todo products & 2. Search result view
  type viewModeType = 'list' | 'search';
  const [viewMode, setViewMode] = useState<viewModeType>('list');

  // Fetch List
  /*
   'fetchListProducts' is the first method that's called when the component is mounted from the useEffect below.
   This sets some of the state like 'isLoading' and 'isError' before it fetches for data from the endpoint defined under 'pages/api/products/index'.
   The api endpoint returns a json with the key 'result' and a status 200 if successful or returns a status 500 along with the 'error' key.
   If the 'result' key is present we safely set the 'productsList'.
  */
  const fetchListProducts = () => {
    setIsLoading(true);
    setIsError(false);

    fetch('/api/products?limit=10')
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

  // Load the initial list of products
  useEffect(() => {
    fetchListProducts();
  }, []);

  // Add a new product
  /*
  'addProduct' takes the 'textInput' state, creates a 'Product' & converts it to a JSON.
  Sends it over as body payload to the api endpoint; which is how the api expects and is defined in 'pages/api/products' 'POST' switch.
  */
  const addProduct = (data: any) => {
    setIsLoading(true);

    fetch('/api/products', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(() => {
      setIsLoading(false);
      fetchListProducts();
    });
  };

  // Delete product
  /*
  'deleteProduct' requires an id value of the Product. When the user presses the 'delete'(cross) button from a Product, this method is invoked.
  It calls the endpoint 'api/product/<id>' with the 'DELETE' method. Read the method 'handleDelete' under pages/api/product/[id]' to learn more how the api handles deletion.
  */
  const deleteProduct = (id?: Product["id"]) => {
    setIsLoading(true);

    fetch('/api/product/' + id, {
      method: 'DELETE'
    }).then(() => {
      setIsLoading(false);
      if (viewMode == 'list') {
        fetchListProducts();
      } else {
        searchQuery();
      }
    });
  };

  // Update product (mark complete/incomplete)
  /*
  'updateProduct' takes the Product object, inverts the 'completed' boolean and calls the same endpoint as 'deletion' but with a different method 'PUT'.
  Navigate to 'api/product/[id]' and read more how the api handles updates under the 'handlePut' method.
  */
  const updateProduct = (product: Product) => {
    setIsLoading(true);

    fetch('/api/product/' + product.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    }).then(() => {
      setIsLoading(false);
      if (viewMode == 'list') {
        fetchListProducts();
      } else {
        searchQuery();
      }
    });
  };

  // Search query
  /*
  'searchQuery' method takes the state from 'textInput' and send it over to the 'api/products/search' endpoint via a query param 'q'.
  The response is the same as the response from "fetch('/api/products')", an array of Products if successful.
  */
  const searchQuery = () => {
    if (queryCheckWiggle()) {
      return;
    }
    setIsLoading(true);

    fetch(`/api/products/search?q=${encodeURI(textInput)}`, {
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
            placeholder="Type an Product to add or search"
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
                fetchListProducts();
              }}
            >
              Go back to list
            </button>
          )}

          {/* Product List */}
          {productsList.length < 1 ? (
            <p className="noProducts">
              {viewMode == 'search' ? 'No products found.. ' : 'Add an product by typing in the field above and hit Add!'}
            </p>
          ) : (
            <ul>
              {productsList.map(each => {
                return (
                  <Each
                    key={each.id}
                    product={each}
                    deleteHandler={deleteProduct}
                    updateHandler={updateProduct}
                  />
                );
              })}
            </ul>
          )}
        </div>
        <div>
          <Form schema={JSON.parse(`{
    "title": "products",
    "description": "Collection of documents with details of products available",
    "properties": {
        "id": {
            "description": "A unique identifier for the product",
            "type": "integer",
            "autoGenerate": true
        },
        "name": {
            "description": "Name of the product",
            "type": "string",
            "maxLength": 100
        },
        "quantity": {
            "description": "Number of products available in the store",
            "type": "integer"
        },
        "price": {
            "description": "Price of the product",
            "type": "number"
        }
    },
    "primary_key": ["id"],
    "required": ["name"]}
`)} validator={validator}
                onSubmit={(event) => addProduct(event.formData)} />
        </div>
        <a href="https://tigrisdata.com/">
          <Image src="/tigris_logo.svg" alt="Tigris Logo" width={100} height={100} />
        </a>
      </div>
    </div>
  );
};

export default Home;
