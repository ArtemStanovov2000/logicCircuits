import type { FC } from "react"

type Props = {
    label: string
}

const Button: FC<Props> = ({label}) => {
    return (
        <button>{label}</button>
    )
}

export default Button