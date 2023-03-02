'use client';

import Image from 'next/image';
import React from 'react';
import { User } from '../../models/tigris/users';

type Props = {
  user: User;
  deleteHandler: (id?: User["id"]) => void;
  updateHandler: (item: User) => void;
};
const EachUser = ({ user, deleteHandler, updateHandler }: Props) => {
  return (
    <>
      <li className="each">
        <button
          className="eachButton"
          onClick={() => {
            updateHandler(user);
          }}
        >

          <span>{user.id}</span>
        </button>
        <button
          className="deleteBtn"
          onClick={() => {
            deleteHandler(user.id);
          }}
        >
          <Image src="/delete.svg" width={24} height={24} alt="Check Image" />
        </button>
      </li>
    </>
  );
};

export default EachUser;
