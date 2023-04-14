import { useSession,getSession } from 'next-auth/react';
import clientPromise from '../api/auth/lib/mongodb';
import React, { useState } from 'react';
import { withLayout } from '../../layout/Layout';
const MainPage = (chek:any) => {

    return (
        <div>
            <fieldset>
                <legend>Choose your monster's features:</legend>

                <div>
                    <input  type="checkbox" id="scales" name="scales"/>
                        <label htmlFor="scales">Scales</label>
                </div>
            </fieldset>

        </div>
    );
};

export default withLayout(MainPage);





export async function getServerSideProps(context:any) {
    const session = await getSession(context)
    if (!session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
    return {
      props: {},
    }
  }