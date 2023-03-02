'use client';

import Image from 'next/image';
import React from 'react';
import { Product } from '../../models/tigris/products';

type Props = {
  product: Product;
  deleteHandler: (id?: Product["id"]) => void;
  updateHandler: (item: Product) => void;
};
const EachProduct = ({ product, deleteHandler, updateHandler }: Props) => {
  return (
    <>
      <li className="each">
        <button
          className="eachButton"
          onClick={() => {
            updateHandler(product);
          }}
        >

          <span>{product.id}</span>
        </button>
        <button
          className="deleteBtn"
          onClick={() => {
            deleteHandler(product.id);
          }}
        >
          <Image src="/delete.svg" width={24} height={24} alt="Check Image" />
        </button>
      </li>
    </>
  );
};

export default EachProduct;
