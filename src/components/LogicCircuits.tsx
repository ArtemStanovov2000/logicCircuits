import type { FC } from "react"
import { useRef, useEffect, useState } from "react"
import { render } from "../render/render"

const LogicCircuits: FC = () => {
    // Референсы
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationFrameRef = useRef<number | null>(null)
    
    // Состояние для отображения слоев - изменено на "substrate"
    const [activeLayers, setActiveLayers] = useState<string>("substrate") // <-- ИЗМЕНЕНО ЗДЕСЬ

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
                render(ctx, canvas.width, canvas.height, activeLayers)
            }
            animationFrameRef.current = requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
            updateCanvasSize()
            if (ctx) {
                render(ctx, canvas.width, canvas.height, activeLayers)
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            window.removeEventListener('resize', handleResize)
        }
    }, [activeLayers])

    // Варианты для радиокнопок
    const layerOptions = [
        { value: "all", label: "Оба слоя" },
        { value: "base", label: "Только подложка" },
        { value: "substrate", label: "Только субстрат" },
    ]

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
                
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    padding: "10px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px"
                }}>
                    <h4 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>Отображение слоев:</h4>
                    
                    {layerOptions.map((option) => (
                        <label
                            key={option.value}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 12px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                backgroundColor: activeLayers === option.value ? "#e3f2fd" : "transparent",
                                transition: "background-color 0.2s",
                                userSelect: "none"
                            }}
                        >
                            <input
                                type="radio"
                                name="layers"
                                value={option.value}
                                checked={activeLayers === option.value}
                                onChange={(e) => setActiveLayers(e.target.value)}
                                style={{
                                    margin: "0",
                                    cursor: "pointer",
                                    width: "16px",
                                    height: "16px"
                                }}
                            />
                            <span style={{
                                fontSize: "14px",
                                fontWeight: activeLayers === option.value ? "600" : "400",
                                color: activeLayers === option.value ? "#1976d2" : "#333"
                            }}>
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>

                {/* Информационный блок */}
                <div style={{
                    marginTop: "20px",
                    padding: "12px",
                    backgroundColor: "#f0f8ff",
                    borderRadius: "8px",
                    borderLeft: "4px solid #1976d2"
                }}>
                    <h5 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#1976d2" }}>
                        Текущий выбор:
                    </h5>
                    <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                        {layerOptions.find(opt => opt.value === activeLayers)?.label || "Не выбрано"}
                    </p>
                </div>
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