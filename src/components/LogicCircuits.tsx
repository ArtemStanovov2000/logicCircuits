import type { FC } from "react"
import { useRef, useEffect } from "react"
import { render } from "../render/render"

const LogicCircuits: FC = () => {
    // Референсы
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationFrameRef = useRef<number | null>(null)

    // Инициализация и анимация канваса
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const updateCanvasSize = () => {
            const container = canvas.parentElement
            if (!container) return

            const containerWidth = container.clientWidth
            const containerHeight = container.clientHeight

            canvas.width = containerWidth
            canvas.height = containerHeight
        }

        updateCanvasSize()

        const animate = () => {
            if (ctx) {
                render(ctx, canvas.width, canvas.height)
            }
            animationFrameRef.current = requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
            updateCanvasSize()
            if (ctx) {
                render(ctx, canvas.width, canvas.height)
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div style={{
            display: "flex",
            width: "100vw",
            height: "100vh"
        }}>
            <aside style={{
                width: "250px",
                backgroundColor: "#abbfffff",
                padding: "20px",
                boxSizing: "border-box",
                borderRight: "1px solid #ddd",
                overflow: "auto",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: "10px"
            }}>
                <h3 style={{ margin: "0 0 20px 0" }}>Управление</h3>
            </aside>

            <div style={{
                flex: 1,
                position: "relative",
                overflow: "hidden"
            }}>
                <canvas
                    ref={canvasRef}
                    style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#ecececff',
                    }}
                />
            </div>
        </div>
    )
}

export default LogicCircuits