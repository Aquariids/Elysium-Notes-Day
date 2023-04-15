import { useState, useEffect } from 'react';

import { useSession } from 'next-auth/react';
import { updateDataInDatabase } from '../../../pages/api/auth/lib/DataFromDatabase';

const Checkbox = () => {
    const [data, setData] = useState<any>();
    const { data: session, status } = useSession();


    async function updateData() {
        const data = {
            _id: session?.user.email,
            email: "привет всем"
        };
        const response = await fetch('/api/updateChek', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.text();
        const newData = await fetch('/api/chek').then(response => response.json());

        // Update the state with the new data
        setData(newData);
    }


    return (
        <div>
            <fieldset>
                <legend>Choose your monster's features:</legend>
                <div>
                    <input type="checkbox" id="scales" name="scales" />
                    <label htmlFor="scales">Scales</label>
                    <button onClick={updateData}>osdfijsdjosijf</button>
                </div>

                {data && data.map((item: any, i: number) => (
                    <div key={i}>{item.email}</div>
                ))}


            </fieldset>
        </div>
    );
};

export default Checkbox;
