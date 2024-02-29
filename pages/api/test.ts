import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { getAllNotesFromDatabase } from "./auth/lib/Get"

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    // Signed in
    res.status(200).json(await getAllNotesFromDatabase(session?.user.userId, session?.user.email));
  } else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}