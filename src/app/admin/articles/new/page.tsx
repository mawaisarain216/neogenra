import ArticleEditor from './ArticleEditor'
export default async function Page({searchParams}:{searchParams:Promise<{id?:string}>}){const {id}=await searchParams;return <ArticleEditor id={id}/>} 
