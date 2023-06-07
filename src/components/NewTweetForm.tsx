import { useSession } from "next-auth/react"
import Button from "./Button"
import ProfileImage from "./ProfileImage"
import { useCallback, useLayoutEffect, useRef, useState } from "react"
import { api } from "~/utils/api"

const updateTextAreaSize = (textArea?: HTMLTextAreaElement) => {
    if (textArea == null) return
    textArea.style.height = '0px'
    textArea.style.height = `${textArea.scrollHeight}px`
}

const Form = () => {
    const session = useSession()
    const [inputValue, setInputValue] = useState('')
    const textAreaRef = useRef<HTMLTextAreaElement>()

    const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
        updateTextAreaSize(textArea)
        textAreaRef.current = textArea
    }, [])

    useLayoutEffect(() => {
        updateTextAreaSize(textAreaRef.current)
    }, [inputValue])

    const createMatter = api.matter.create.useMutation({
        onSuccess: newMatter => {
            console.log(newMatter)
            setInputValue('')
        }
    })

    if (session.status != 'authenticated') return null

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        createMatter.mutate({
            content: inputValue,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-b px-4 py-2">
            <div className="flex gap-4">
                <ProfileImage src={session.data.user.image} />
                <textarea ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)} style={{ height: 0 }} className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none" placeholder="What's happening?" />
            </div>
            <Button className="self-end">Tweet</Button>
        </form>
    )
}

const NewTweetForm = () => {
    const session = useSession()
    if (session.status != 'authenticated') return

    return <Form />
}

export default NewTweetForm