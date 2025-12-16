import type { FC } from "react"
import { useRef, useEffect } from "react"

const LogicCircuits: FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationFrameRef = useRef<number>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const animate = () => {
            if (ctx) {
                //render(ctx, canvas.width, canvas.height)
            }
            animationFrameRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [])

    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current
            if (canvas) {
                canvas.width = window.innerWidth
                canvas.height = window.innerHeight
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                display: 'block',
                width: '100vw',
                height: '100vh',
                backgroundColor: '#0e0e0eff',
            }}
        />
    )
}

export default LogicCircuits