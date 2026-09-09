import UserEditor from './UserEditor'
export default async function Page({searchParams}:{searchParams:Promise<{id?:string}>}){const {id}=await searchParams;return <UserEditor id={id}/>} 
