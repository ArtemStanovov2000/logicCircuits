import type { FC } from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import { render } from "../render/render"
import { CELL_SIZE } from "../consts/mapConfig"
import { map } from "../map/map"
import { getContactAtPosition } from "../utils/collisionDetection"
import type { ContactInfo } from "../utils/collisionDetection"
import type { Wire, Line } from "../types/Wire"
import { wires } from "../map/line"
import type { Transistor, Contact, controlledPointId } from "../types/MapCell"

const LogicCircuits: FC = () => {
    // Референсы
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationFrameRef = useRef<number | null>(null)

    // Состояние UI
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
    const [drawingMode, setDrawingMode] = useState(true)
    const [currentCellInfo, setCurrentCellInfo] = useState<string>("Нет ячейки")
    const [hoveredContact, setHoveredContact] = useState<ContactInfo | null>(null)

    // Состояние для рисования проводов
    const [isDrawingWire, setIsDrawingWire] = useState(false)
    const [currentWire, setCurrentWire] = useState<{
        startContact: ContactInfo;
        lines: Line[];
        tempLines: Line[] | null;
    } | null>(null)

    // Флаг для принудительного обновления (для реакции на изменения карты)
    const [forceUpdate, setForceUpdate] = useState(0)

    // Последняя фиксированная точка провода
    const lastFixedPoint = useRef<{x: number, y: number} | null>(null)

    // Генератор ID для проводов
    const nextWireId = useRef(0)

    // Функция для получения ячейки по координатам
    const getCellAtPosition = useCallback((x: number, y: number) => {
        const column = Math.floor(x / CELL_SIZE)
        const row = Math.floor(y / CELL_SIZE)
        
        if (
            column >= 0 && 
            column < map.length && 
            row >= 0 && 
            row < (map[column]?.length || 0)
        ) {
            return map[column][row]
        }
        
        return null
    }, [])

    // Функция для обновления UI после изменения карты
    const refreshCanvas = useCallback(() => {
        setForceUpdate(prev => prev + 1)
    }, [])

    // Переключение состояния контакта (contact)
    const toggleContactState = useCallback((column: number, row: number) => {
        const cell = map[column][row]
        
        if (!cell) return
        
        // Переключаем состояние только для элементов типа 'contact'
        if (cell.type === 'contact') {
            const contact = cell as Contact
            contact.isActive = !contact.isActive
            
            console.log(`${cell.type} в позиции [${column}, ${row}] переключен на: ${contact.isActive}`)
            
            // Принудительно обновляем canvas
            refreshCanvas()
        }
    }, [refreshCanvas])

    // Создает ортогональную линию (горизонтальную или вертикальную)
    const createOrthogonalLine = useCallback((
        startX: number, 
        startY: number, 
        endX: number, 
        endY: number,
        mode: 'horizontal-first' | 'vertical-first' = 'horizontal-first'
    ): Line[] => {
        const lines: Line[] = []
        
        if (mode === 'horizontal-first') {
            if (startX !== endX) {
                lines.push({
                    xStart: startX,
                    yStart: startY,
                    xEnd: endX,
                    yEnd: startY
                })
            }
            if (startY !== endY) {
                lines.push({
                    xStart: endX,
                    yStart: startY,
                    xEnd: endX,
                    yEnd: endY
                })
            }
        } else {
            if (startY !== endY) {
                lines.push({
                    xStart: startX,
                    yStart: startY,
                    xEnd: startX,
                    yEnd: endY
                })
            }
            if (startX !== endX) {
                lines.push({
                    xStart: startX,
                    yStart: endY,
                    xEnd: endX,
                    yEnd: endY
                })
            }
        }
        
        return lines
    }, [])

    // Проверяем, является ли контакт валидным началом провода
    const isValidStartContact = useCallback((contact: ContactInfo): boolean => {
        // Сначала получаем ячейку, чтобы проверить её точный тип
        const cell = map[contact.elementPosition.column]?.[contact.elementPosition.row]
        
        if (!cell) return false
        
        // Проверяем оба типа транзисторов
        if ((cell.type === 'transistor-close' || cell.type === 'transistor-open') && 
            contact.contactType === 'drain') {
            return true
        }
        if (contact.type === 'contact') {
            return true
        }
        return false
    }, [])

    // Проверяем, является ли контакт валидным концом провода
    const isValidEndContact = useCallback((contact: ContactInfo): boolean => {
        // Сначала получаем ячейку, чтобы проверить её точный тип
        const cell = map[contact.elementPosition.column]?.[contact.elementPosition.row]
        
        if (!cell) return false
        
        // Проверяем оба типа транзисторов
        if ((cell.type === 'transistor-close' || cell.type === 'transistor-open') && 
            (contact.contactType === 'source' || contact.contactType === 'base')) {
            return true
        }
        if (contact.type === 'output') {
            return true
        }
        return false
    }, [])

    // Получаем тип провода для стартовой точки
    const getStartPointType = useCallback((contact: ContactInfo): 'drain' | 'contact' => {
        // Сначала получаем ячейку, чтобы проверить её точный тип
        const cell = map[contact.elementPosition.column]?.[contact.elementPosition.row]
        
        if (!cell) return 'contact'
        
        // Проверяем оба типа транзисторов
        if ((cell.type === 'transistor-close' || cell.type === 'transistor-open') && 
            contact.contactType === 'drain') {
            return 'drain'
        }
        return 'contact'
    }, [])

    // Получаем тип провода для конечной точки
    const getEndPointType = useCallback((contact: ContactInfo): 'source' | 'base' | 'output' => {
        // Сначала получаем ячейку, чтобы проверить её точный тип
        const cell = map[contact.elementPosition.column]?.[contact.elementPosition.row]
        
        if (!cell) return 'output'
        
        // Проверяем оба типа транзисторов
        if (cell.type === 'transistor-close' || cell.type === 'transistor-open') {
            return contact.contactType as 'source' | 'base'
        }
        return 'output'
    }, [])

    // Обновляем controlledBy у элемента
    const updateControlledBy = useCallback((
        endContact: ContactInfo,
        startContact: ContactInfo,
        startPointType: 'drain' | 'contact'
    ) => {
        const endColumn = endContact.elementPosition.column
        const endRow = endContact.elementPosition.row
        
        const startControlledPointId: controlledPointId = {
            row: startContact.elementPosition.row,
            column: startContact.elementPosition.column,
            type: startPointType
        }

        const endCell = map[endColumn][endRow]
        
        if (!endCell) return
        
        if (endCell.type === 'transistor-close' || endCell.type === 'transistor-open') {
            const transistor = endCell as Transistor
            if (endContact.contactType === 'source') {
                transistor.controlledBy.source.push(startControlledPointId)
            } else if (endContact.contactType === 'base') {
                transistor.controlledBy.base.push(startControlledPointId)
            }
        } else if (endCell.type === 'contact' || endCell.type === 'output') {
            const contact = endCell as Contact
            contact.controlledBy.connection.push(startControlledPointId)
        }
        
        // Обновляем canvas после изменения controlledBy
        refreshCanvas()
    }, [refreshCanvas])

    // Начинаем рисовать провод
    const startWireDrawing = useCallback((startContact: ContactInfo) => {
        if (!isValidStartContact(startContact)) return
        
        setIsDrawingWire(true)
        const startPos = startContact.contactPosition
        lastFixedPoint.current = { x: startPos.x, y: startPos.y }
        
        setCurrentWire({
            startContact,
            lines: [],
            tempLines: null
        })
    }, [isValidStartContact])

    // Добавляем сегмент провода
    const addWireSegment = useCallback((x: number, y: number) => {
        if (!currentWire || !lastFixedPoint.current) return
        
        const { x: lastX, y: lastY } = lastFixedPoint.current
        
        const newLines = createOrthogonalLine(lastX, lastY, x, y)
        
        if (newLines.length > 0) {
            const lastLine = newLines[newLines.length - 1]
            lastFixedPoint.current = { x: lastLine.xEnd, y: lastLine.yEnd }
            
            setCurrentWire(prev => prev ? {
                ...prev,
                lines: [...prev.lines, ...newLines],
                tempLines: null
            } : null)
        }
    }, [currentWire, createOrthogonalLine])

    // Завершаем провод
    const finishWire = useCallback((endContact: ContactInfo) => {
        if (!currentWire || !lastFixedPoint.current || !isValidEndContact(endContact)) return
        
        const endPos = endContact.contactPosition
        const { x: lastX, y: lastY } = lastFixedPoint.current
        
        const finalLines = createOrthogonalLine(lastX, lastY, endPos.x, endPos.y)
        
        const wire: Wire = {
            id: nextWireId.current++,
            lines: [...currentWire.lines, ...finalLines],
            startPoint: getStartPointType(currentWire.startContact),
            endPoint: getEndPointType(endContact)
        }
        
        wires.push(wire)
        
        updateControlledBy(
            endContact,
            currentWire.startContact,
            getStartPointType(currentWire.startContact)
        )
        
        setIsDrawingWire(false)
        setCurrentWire(null)
        lastFixedPoint.current = null
    }, [currentWire, isValidEndContact, getStartPointType, getEndPointType, updateControlledBy, createOrthogonalLine])

    // Отменяем рисование провода
    const cancelWireDrawing = useCallback(() => {
        setIsDrawingWire(false)
        setCurrentWire(null)
        lastFixedPoint.current = null
    }, [])

    // Обновляем информацию о ячейке и контакте при движении курсора
    const updateCellInfo = useCallback((x: number, y: number) => {
        const cell = getCellAtPosition(x, y)
        
        if (!cell) {
            setCurrentCellInfo("Пустая ячейка")
            setHoveredContact(null)
            return
        }
        
        const column = Math.floor(x / CELL_SIZE)
        const row = Math.floor(y / CELL_SIZE)
        
        const contactInfo = getContactAtPosition(x, y, cell, column, row)
        
        setHoveredContact(contactInfo)
        
        if (contactInfo) {
            let info = ""
            
            // Получаем фактическую ячейку для определения точного типа
            const actualCell = map[column]?.[row]
            
            if (actualCell && (actualCell.type === 'transistor-close' || actualCell.type === 'transistor-open')) {
                info = `Транзистор (${actualCell.type === 'transistor-close' ? 'закрытый' : 'открытый'}): ${contactInfo.contactType}`
                info += `\nАктивен: ${contactInfo.isActive ? 'Да ✓' : 'Нет ✗'}`
                info += `\nПозиция: [${column}, ${row}]`
            } else if (contactInfo.type === 'contact') {
                info = `Контакты (contact)`
                info += `\nАктивен: ${contactInfo.isActive ? 'Да ✓' : 'Нет ✗'}`
                info += `\nПозиция: [${column}, ${row}]`
                info += `\n(Клик для переключения)`
            } else if (contactInfo.type === 'output') {
                info = `Контакты (output)`
                info += `\nАктивен: ${contactInfo.isActive ? 'Да ✓' : 'Нет ✗'}`
                info += `\nПозиция: [${column}, ${row}]`
                info += `\n(Клик для переключения)`
            }
            
            setCurrentCellInfo(info)
        } else {
            let info = `Тип: ${cell.type}`
            
            if (cell.type === 'transistor-close' || cell.type === 'transistor-open') {
                const transistor = cell as Transistor
                info += `\nОриентация: ${transistor.orientation}`
                info += `\nDrain: ${transistor.drain ? 'Да' : 'Нет'}, Source: ${transistor.source ? 'Да' : 'Нет'}, Base: ${transistor.base ? 'Да' : 'Нет'}`
            } else if (cell.type === 'contact' || cell.type === 'output') {
                const contact = cell as Contact
                info += `\nАктивен: ${contact.isActive ? 'Да ✓' : 'Нет ✗'}`
                info += `\n(Клик для переключения)`
            }
            
            info += `\nПозиция: [${column}, ${row}]`
            setCurrentCellInfo(info)
        }
    }, [getCellAtPosition])

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
                render(
                    ctx, 
                    canvas.width, 
                    canvas.height,
                    currentWire?.lines || [],
                    currentWire?.tempLines || null
                )
            }
            animationFrameRef.current = requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
            updateCanvasSize()
            if (ctx) {
                render(
                    ctx, 
                    canvas.width, 
                    canvas.height,
                    currentWire?.lines || [],
                    currentWire?.tempLines || null
                )
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            window.removeEventListener('resize', handleResize)
        }
    }, [currentWire, forceUpdate]) // Добавляем forceUpdate в зависимости

    // Обработка событий клавиатуры
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setDrawingMode(false)
                if (isDrawingWire) {
                    cancelWireDrawing()
                }
            }
            if (e.key === 'd' || e.key === 'D') {
                setDrawingMode(prev => !prev)
            }
            if (e.key === 'Enter' && isDrawingWire) {
                if (currentWire && hoveredContact && isValidEndContact(hoveredContact)) {
                    finishWire(hoveredContact)
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isDrawingWire, currentWire, hoveredContact, isValidEndContact, finishWire, cancelWireDrawing])

    // Вспомогательные функции
    const toggleDrawingMode = useCallback(() => {
        setDrawingMode(prev => !prev)
    }, [])

    // Обработчики событий мыши
    const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        const mouseX = (event.clientX - rect.left) * scaleX
        const mouseY = (event.clientY - rect.top) * scaleY

        const pixelX = Math.floor(mouseX)
        const pixelY = Math.floor(mouseY)
        
        setCursorPos({ x: pixelX, y: pixelY })
        updateCellInfo(pixelX, pixelY)
        
        if (isDrawingWire && currentWire && lastFixedPoint.current) {
            const { x: lastX, y: lastY } = lastFixedPoint.current
            
            const cell = getCellAtPosition(pixelX, pixelY)
            const column = Math.floor(pixelX / CELL_SIZE)
            const row = Math.floor(pixelY / CELL_SIZE)
            const contactInfo = cell ? getContactAtPosition(pixelX, pixelY, cell, column, row) : null
            
            let endX = pixelX
            let endY = pixelY
            
            if (contactInfo && isValidEndContact(contactInfo)) {
                endX = contactInfo.contactPosition.x
                endY = contactInfo.contactPosition.y
            }
            
            const tempLines = createOrthogonalLine(lastX, lastY, endX, endY)
            
            setCurrentWire(prev => prev ? {
                ...prev,
                tempLines: tempLines
            } : null)
        }
    }, [updateCellInfo, isDrawingWire, currentWire, getCellAtPosition, isValidEndContact, createOrthogonalLine])

    const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        const clickX = (event.clientX - rect.left) * scaleX
        const clickY = (event.clientY - rect.top) * scaleY

        const pixelX = Math.floor(clickX)
        const pixelY = Math.floor(clickY)

        const column = Math.floor(pixelX / CELL_SIZE)
        const row = Math.floor(pixelY / CELL_SIZE)
        const cell = getCellAtPosition(pixelX, pixelY)
        const contactInfo = cell ? getContactAtPosition(pixelX, pixelY, cell, column, row) : null

        if (isDrawingWire) {
            // Режим рисования провода
            if (contactInfo) {
                if (isValidEndContact(contactInfo)) {
                    finishWire(contactInfo)
                } else {
                    addWireSegment(pixelX, pixelY)
                }
            } else {
                addWireSegment(pixelX, pixelY)
            }
        } else {
            // НЕ режим рисования провода
            if (contactInfo) {
                if (drawingMode) {
                    // Если в режиме рисования (drawingMode=true), начинаем провод с валидного контакта
                    if (isValidStartContact(contactInfo)) {
                        startWireDrawing(contactInfo)
                    }
                } else {
                    // Если не в режиме рисования (drawingMode=false), переключаем состояние контакта
                    if (contactInfo.type === 'contact' || contactInfo.type === 'output') {
                        toggleContactState(column, row)
                    }
                }
            } else {
                // Клик не на контакте, но может быть на ячейке типа 'contact' или 'output'
                if (cell && (cell.type === 'contact' || cell.type === 'output')) {
                    toggleContactState(column, row)
                }
            }
        }
    }, [
        getCellAtPosition, 
        isDrawingWire, 
        drawingMode,
        isValidStartContact, 
        isValidEndContact, 
        startWireDrawing, 
        addWireSegment, 
        finishWire,
        toggleContactState
    ])

    const handleMouseEnter = useCallback(() => {
        if (canvasRef.current) {
            let cursor = 'default'
            
            if (isDrawingWire) {
                cursor = 'crosshair'
            } else if (hoveredContact) {
                if (drawingMode && isValidStartContact(hoveredContact)) {
                    cursor = 'cell'
                } else if (!drawingMode && (hoveredContact.type === 'contact' || hoveredContact.type === 'output')) {
                    cursor = 'pointer' // Для переключения состояния
                } else if (isValidEndContact(hoveredContact)) {
                    cursor = 'copy'
                } else {
                    cursor = 'pointer'
                }
            } else if (drawingMode) {
                cursor = 'crosshair'
            }
            
            canvasRef.current.style.cursor = cursor
        }
    }, [drawingMode, hoveredContact, isDrawingWire, isValidStartContact, isValidEndContact])

    const handleMouseLeave = useCallback(() => {
        setCurrentCellInfo("Нет ячейки")
        setHoveredContact(null)
        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'default'
        }
    }, [])

    // Обновляем курсор при изменении состояния
    useEffect(() => {
        if (canvasRef.current) {
            let cursor = 'default'
            
            if (isDrawingWire) {
                cursor = 'crosshair'
            } else if (hoveredContact) {
                if (drawingMode && isValidStartContact(hoveredContact)) {
                    cursor = 'cell'
                } else if (!drawingMode && (hoveredContact.type === 'contact' || hoveredContact.type === 'output')) {
                    cursor = 'pointer'
                } else if (isValidEndContact(hoveredContact)) {
                    cursor = 'copy'
                } else {
                    cursor = 'pointer'
                }
            } else if (drawingMode) {
                cursor = 'crosshair'
            }
            
            canvasRef.current.style.cursor = cursor
        }
    }, [hoveredContact, drawingMode, isDrawingWire, isValidStartContact, isValidEndContact])

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

                <button
                    onClick={toggleDrawingMode}
                    style={{
                        padding: "10px",
                        backgroundColor: drawingMode ? "#18b81dff" : "#f0f0f0",
                        color: drawingMode ? "white" : "black",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: drawingMode ? "bold" : "normal",
                        marginBottom: "10px"
                    }}
                >
                    {drawingMode ? "Режим проводов: ВКЛ" : "Режим проводов: ВЫКЛ"}
                </button>

                {isDrawingWire && (
                    <div style={{
                        padding: "10px",
                        backgroundColor: "#fff3cd",
                        borderRadius: "4px",
                        border: "1px solid #ffc107",
                        marginBottom: "10px"
                    }}>
                        <h4 style={{ margin: "0 0 8px 0", color: "#856404" }}>Рисование ортогонального провода</h4>
                        <div style={{ fontSize: "12px", lineHeight: "1.5" }}>
                            <div>• Кликните, чтобы добавить изгиб (90° угол)</div>
                            <div>• Линии автоматически выравниваются по осям</div>
                            <div>• Кликните на конечный контакт, чтобы завершить</div>
                            <div>• Esc для отмены</div>
                            <div>• Enter для быстрого завершения</div>
                        </div>
                    </div>
                )}

                <div style={{
                    padding: "10px",
                    backgroundColor: "white",
                    borderRadius: "4px",
                    border: "1px solid #ddd"
                }}>
                    <h4 style={{ margin: "0 0 8px 0" }}>Информация</h4>
                    <div>Позиция курсора: ({cursorPos.x}, {cursorPos.y})</div>
                    <div>Ячейка: [{(Math.floor(cursorPos.x / CELL_SIZE))}, {(Math.floor(cursorPos.y / CELL_SIZE))}]</div>
                    
                    <div style={{ 
                        marginTop: "8px", 
                        padding: "8px",
                        backgroundColor: hoveredContact ? "#f0f8ff" : "#f9f9f9",
                        borderRadius: "4px",
                        border: hoveredContact ? "1px solid #4a90e2" : "1px solid #e0e0e0"
                    }}>
                        {hoveredContact ? (
                            <>
                                <div style={{ 
                                    fontWeight: "bold", 
                                    color: hoveredContact.isActive ? "#2e7d32" : "#c62828",
                                    marginBottom: "4px"
                                }}>
                                    {(() => {
                                        // Получаем фактическую ячейку для определения точного типа
                                        const cell = map[hoveredContact.elementPosition.column]?.[hoveredContact.elementPosition.row]
                                        if (cell && (cell.type === 'transistor-close' || cell.type === 'transistor-open')) {
                                            return `Транзистор (${cell.type === 'transistor-close' ? 'закрытый' : 'открытый'}) (${hoveredContact.contactType})`
                                        } else if (hoveredContact.type === 'contact') {
                                            return 'Контакты (contact)'
                                        } else if (hoveredContact.type === 'output') {
                                            return 'Контакты (output)'
                                        }
                                        return 'Неизвестный элемент'
                                    })()}
                                </div>
                                <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                                    <div>Активен: <strong>{hoveredContact.isActive ? "Да ✓" : "Нет ✗"}</strong></div>
                                    <div>Позиция: [{hoveredContact.elementPosition.column}, {hoveredContact.elementPosition.row}]</div>
                                    <div style={{ marginTop: "4px", fontWeight: "bold" }}>
                                        {drawingMode && isValidStartContact(hoveredContact) && "Можно начать провод"}
                                        {isValidEndContact(hoveredContact) && "Можно завершить провод"}
                                        {!drawingMode && (hoveredContact.type === 'contact' || hoveredContact.type === 'output') && "Клик для переключения"}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={{ 
                                whiteSpace: "pre-line",
                                fontSize: "12px",
                                lineHeight: "1.4"
                            }}>
                                {currentCellInfo}
                                {isDrawingWire && currentWire && (
                                    <div style={{ marginTop: "8px", color: "#666" }}>
                                        Рисуется провод. Сегментов: {currentWire.lines.length}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{
                    padding: "10px",
                    backgroundColor: "white",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    marginTop: "10px"
                }}>
                    <h4 style={{ margin: "0 0 8px 0" }}>Управление клавишами</h4>
                    <div style={{ fontSize: "12px", lineHeight: "1.5" }}>
                        <div><strong>D</strong> - переключить режим проводов</div>
                        <div><strong>Esc</strong> - отмена/выход</div>
                        <div><strong>Enter</strong> - завершить провод</div>
                        <div><strong>Правый клик</strong> - отмена рисования провода</div>
                        <div style={{ marginTop: "4px", fontStyle: "italic" }}>
                            {drawingMode 
                                ? "Режим проводов: соединяйте элементы"
                                : "Режим редактирования: кликайте на contact/output для переключения"}
                        </div>
                    </div>
                </div>

                <div style={{
                    padding: "10px",
                    backgroundColor: "white",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    marginTop: "10px"
                }}>
                    <h4 style={{ margin: "0 0 8px 0" }}>Статус</h4>
                    <div style={{ fontSize: "12px", lineHeight: "1.5" }}>
                        <div>
                            Режим: <span style={{ 
                                color: drawingMode ? "#2e7d32" : "#1565c0",
                                fontWeight: "bold"
                            }}>
                                {drawingMode ? "Провода" : "Редактирование"}
                            </span>
                        </div>
                        <div>
                            Провод: <span style={{ 
                                color: isDrawingWire ? "#ff9800" : "#666",
                                fontWeight: isDrawingWire ? "bold" : "normal"
                            }}>
                                {isDrawingWire ? "Рисуется" : "Не рисуется"}
                            </span>
                        </div>
                        <div>
                            Над контактом: <span style={{ 
                                color: hoveredContact ? "#1565c0" : "#666",
                                fontWeight: hoveredContact ? "bold" : "normal"
                            }}>
                                {hoveredContact ? "Да" : "Нет"}
                            </span>
                        </div>
                        <div>
                            Всего проводов: <span style={{ fontWeight: "bold" }}>{wires.length}</span>
                        </div>
                    </div>
                </div>
            </aside>

            <div style={{
                flex: 1,
                position: "relative",
                overflow: "hidden"
            }}>
                <canvas
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleCanvasClick}
                    onContextMenu={(e) => {
                        e.preventDefault()
                        if (isDrawingWire) {
                            cancelWireDrawing()
                        }
                    }}
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