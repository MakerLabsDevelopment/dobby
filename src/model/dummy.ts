import {BaseID, TableID, ColumnID, RowID, Base, Table, Column, Row, CellValue, DobbyRepo, newTableId, newRowId, newColumnId, newBaseId, equalIds} from "./model"
import * as uuid from "uuid"


interface DummyBaseData {
    name: string,
    id: string,
    tables: {
        [index: string]: {
            id: string,
            columns: Column[],
            name: string,
            rows: {[index: string]: CellValue}[],
        };
    }
}

class DummyBase {
    id: BaseID
    name: string
    tables: DummyTable[]

    constructor(id: BaseID, baseData: DummyBaseData){
        this.id = id
        this.name = baseData.name
        this.tables = []
        for (const tableName in baseData.tables) {
            const tableData = baseData.tables[tableName]
            const tableId = newTableId(tableData.id)
            this.tables.push(new DummyTable(
                tableId,
                tableData.name,
                tableData.columns,
                tableData.rows.map(rowDef => {
                    const cells = new Map()
                    for (const columnIdStr in rowDef) {
                        const rawValue = rowDef[columnIdStr]
                        let value = {}
                        if (typeof rawValue === "number") {
                            value = {
                                type: "number",
                                value: rawValue,
                            }
                        } else if (typeof rawValue === "string") {
                            value = {
                                type: "string",
                                value: rawValue
                            }
                        } else {
                            throw  new Error("Unsupported value " + rawValue.toString())
                        }
                        cells.set(newColumnId(columnIdStr), value)
                    }
                    return new DummyRow(
                        newRowId(uuid.v4().toString()),
                        cells,
                    )
                })
            ))
        }
    }
}

class DummyTable {
    id: TableID
    name: string
    columns: Array<Column>
    rows: DummyRow[]

    constructor(id: TableID, name: string, columns: Array<Column>, rows: DummyRow[]) {
        this.id = id
        this.name = name
        this.columns = columns
        this.rows = rows
    }
}

class DummyRow {
    id: RowID
    cells: Map<ColumnID, CellValue>

    constructor(id: RowID, cells: Map<ColumnID, CellValue>) {
        this.id = id
        this.cells = cells
    }
}


export class DummyRepo implements DobbyRepo {
    bases: Map<BaseID, DummyBase>

    constructor(bases: Map<BaseID, DummyBase>) {
        this.bases = bases
    }

    public async listBases(): Promise<Base[]> {
        return Array.from(this.bases.values())
    }
    public async rowsForTable(baseId: BaseID, tableId: TableID): Promise<Row[] | null> {
        const base = this.bases.get(baseId)
        if (base == null) {
            return null
        }
        const table = base.tables.find(t => equalIds(t.id, tableId))
        if (table == null) {
            throw new Error("No such table")
        }
        return table.rows
    }
    public async createTable(baseId: BaseID, name: string, columns: Array<Column>): Promise<Table> {
        const base = this.bases.get(baseId)
        if (base == null) {
            throw new Error("No such base " + baseId.value)
        }
        const id = uuid.v4()
        const table = new DummyTable(newTableId(id.toString()), name, columns, [])
        base.tables.push(table)
        return table
    }
    public async insertRow(baseId: BaseID, tableId: TableID, values: Map<ColumnID, CellValue>): Promise<Row> {
        const base = this.bases.get(baseId)
        if (base == null) {
            throw new Error("No such base " + baseId.value)
        }
        const table = base.tables.find(t => equalIds(t.id, tableId))
        if (table == null) {
            throw new Error("No such table " + tableId.value)
        }
        const rowId = newRowId(uuid.v4().toString())
        const row = new DummyRow(rowId, values)
        table.rows.push(row)
        return row
    }
    public async updateRow(baseId: BaseID, tableId: TableID, rowId: RowID, newValues: Map<ColumnID, CellValue>): Promise<void> {
        const base = this.bases.get(baseId)
        if (base == null) {
            throw new Error("No such base " + baseId)
        }

        const table = base.tables.find(t => equalIds(t.id, tableId))
        if (table == null) {
            throw new Error("No such table " + tableId)
        }

        const row = table.rows.find(r => equalIds(r.id, rowId))
        if (row == null) {
            throw new Error("No such row " + rowId)
        }
        row.cells = newValues
        return
    }
    public async deleteRow(baseId: BaseID, tableId: TableID, rowId: RowID): Promise<void> {
        const base = this.bases.get(baseId)
        if (base == null) {
            throw new Error("No such base " + baseId)
        }
        const table = base.tables.find(t => equalIds(t.id, tableId))
        if (table == null) {
            throw new Error("No such table " + tableId)
        }

        const row = table.rows.find(r => equalIds(r.id, rowId))
        if (row == null) {
            throw new Error("No such row " + rowId)
        }
        const indexToRemove = table.rows.indexOf(row)
        table.rows.splice(indexToRemove, 1)
        return
    }
}

export function newDummyRepo(dummyData: DummyBaseData[]): DobbyRepo {
    const bases = new Map()
    for (const baseData of dummyData) {
        const baseId = newBaseId(baseData.id)
        bases.set(baseId, new DummyBase(baseId, baseData))
    }
    return new DummyRepo(bases)
}
