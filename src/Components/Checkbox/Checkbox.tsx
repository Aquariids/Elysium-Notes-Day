import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
const Checkbox = () => {
    const [data, setData] = useState<any>();
    const { data: session, status } = useSession();
    const [value, setValue] = useState<string>('');
    async function updateData() {
        const userId = session?.user.userId;
        const data = {
            email: session?.user.email,
            userId: userId,
            body: value
        };


        const response = await fetch('/api/updateChek', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.text();
        const newData = await fetch(`/api/chek?userId=${userId}`).then(response => response.json());
        setData(newData);
    }


    useEffect(() => {
    const userId = session?.user.userId;
    fetch(`/api/chek?userId=${userId}`)
        .then(response => response.json())
        .then(data => setData(data))
},[session])


    return (
        <div>
            <fieldset>
                <legend>Choose your monster's features:</legend>
                <div>
                    <input type="checkbox" id="scales" name="scales" />
                    <label htmlFor="scales">Scales</label>
                    <textarea value={value} onChange={event => setValue(event.target.value)}></textarea>
                    <button onClick={updateData}>osdfijsdjosijf</button>
                </div>

                {data && data.map((item: any, i: number) => (
                    <div key={i}>{item.body}</div>
                ))}


            </fieldset>
        </div>
    );
};

export default Checkbox;
