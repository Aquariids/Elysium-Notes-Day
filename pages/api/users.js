import clientPromise from "./auth/lib/mongodb";


export async function getServerSidePropps() {
    try {
        const client = await clientPromise;
        const db = client.db("elysium");

        const users = await db
            .collection("users")
            .find({})
            .toArray();

        return {
            props: { users: JSON.parse(JSON.stringify(users)) }
        }
    } catch (e) {
        console.error(e);
    }
};