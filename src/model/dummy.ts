import {BaseID, TableID, ColumnID, RowID, Base, Table, Column, Row, CellValue, DobbyRepo, newTableId, newRowId, newBaseId, equalIds, newColumnId, RepoListener, ListenerID, newListenerId} from "./model"
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
    tables: Array<DummyTable>

    constructor(id: BaseID, baseData: DummyBaseData){
        this.id = id
        this.name = baseData.name
        this.tables = []
        for (const tableName in baseData.tables) {
            const tableData = baseData.tables[tableName]
            const tableId = newTableId(tableData.id)
            const table = new DummyTable(
                tableId,
                tableData.name,
                tableData.columns,
                tableData.rows.map(d => {
                  const vals: Map<ColumnID, CellValue> = new Map()
                  for (const rawColId in d) {
                    vals.set(newColumnId(rawColId), d[rawColId])
                  }
                  return new DummyRow(newRowId(uuid.v4().toString()), vals)
                }),
            )
            this.tables.push(table)
        }
    }
}

class DummyRow implements Row {
  id: RowID
  cellValues: Map<string, CellValue>

  constructor(id: RowID, rowDef: Map<ColumnID, CellValue>){
    this.id = id
    this.cellValues = new Map()
    for (const [columnId, cellVal] of rowDef) {
      this.cellValues.set(columnId.value, cellVal)
    }
  }

  cellValue(columnId: ColumnID): CellValue | null {
    return this.cellValues.get(columnId.value) ?? null
  }
}

class DummyTable {
    id: TableID
    name: string
    columns: Array<Column>
    rows: Array<DummyRow>

    constructor(id: TableID, name: string, columns: Array<Column>, rows: DummyRow[]) {
        this.id = id
        this.name = name
        this.columns = columns
        this.rows = rows
    }
}

export class DummyRepo implements DobbyRepo {
    bases: Map<BaseID, DummyBase>
    listeners: Map<string, RepoListener>

    constructor(bases: Map<BaseID, DummyBase>) {
        this.bases = bases
        this.listeners = new Map()
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
        return [...table.rows]
    }
    public async createTable(baseId: BaseID, name: string, columns: Array<Column>): Promise<Table> {
        const base = this.bases.get(baseId)
        if (base == null) {
            throw new Error("No such base " + baseId.value)
        }
        const id = uuid.v4()
        const table = new DummyTable(newTableId(id.toString()), name, columns, [])
        base.tables.push(table)
        this.notifyListeners()
        return table
    }
    public async insertColumn(baseId: BaseID, tableId: TableID, index?: (number | null)): Promise<Column> {
        const base = this.bases.get(baseId)
        if (base == null) {
            throw new Error("No such base " + baseId.value)
        }
        const table = base.tables.find(t => equalIds(t.id, tableId))
        if (table == null) {
            throw new Error("No such table " + tableId.value)
        }
        const columnId = newColumnId(uuid.v4().toString())
        const column = {
          id: columnId,
          description: "Field",
          type: "string" as const
        }
        if (index == null) {
          table.columns.push(column)
        } else {
          table.columns.splice(index, 0, column)
        }
        this.notifyListeners()
        return column
    }
    public async updateColumn(
      baseId: BaseID,
      tableId: TableID,
      columnId: ColumnID,
      description: (string | null),
      type: ("string" | "number" | null)
    ): Promise<void> {
        const base = this.bases.get(baseId)
        if (base == null) {
            throw new Error("No such base " + baseId)
        }
        const table = base.tables.find(t => equalIds(t.id, tableId))
        if (table == null) {
            throw new Error("No such table " + tableId)
        }
        const column = table.columns.find(c => equalIds(c.id, columnId))
        if (column == null) {
            throw new Error("No such column " + columnId)
        }
        if (description !== null) {
            column.description = description
        }
        if (type !== null) {
            column.type = type
        }
        this.notifyListeners()
        return
    }
    public async deleteColumn(baseId: BaseID, tableId: TableID, columnId: ColumnID): Promise<void> {
        const base = this.bases.get(baseId)
        if (base == null) {
            throw new Error("No such base " + baseId)
        }
        const table = base.tables.find(t => equalIds(t.id, tableId))
        if (table == null) {
            throw new Error("No such table " + tableId)
        }

        const column = table.columns.find(c => equalIds(c.id, columnId))
        if (column == null) {
            throw new Error("No such row " + columnId)
        }
        const indexToRemove = table.columns.indexOf(column)
        table.columns.splice(indexToRemove, 1)
        this.notifyListeners()
        return
    }
    public async insertRow(baseId: BaseID, tableId: TableID, index: (number | null), values: Map<ColumnID, CellValue>): Promise<Row> {
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
        if (index == null) {
          table.rows.push(row)
        } else {
          table.rows.splice(index, 0, row)
        }
        this.notifyListeners()
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
        const newColumnIds: Set<string> = new Set()
        for (const [columnId, value] of newValues) {
          row.cellValues[columnId.value] = value
          newColumnIds.add(columnId.value)
        }
        for (const rawColumnId in row.cellValues.keys()) {
          if (!newColumnIds.has(rawColumnId)) {
            row.cellValues.delete(rawColumnId)
          }
        }
        this.notifyListeners()
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
        this.notifyListeners()
        return
    }

    public addListener(listener: RepoListener): ListenerID {
        const id = newListenerId(uuid.v4().toString())
        this.listeners.set(id.value, listener)
        return id
    }

    public removeListener(listenerId: ListenerID): void {
        this.listeners.delete(listenerId.value)
    }

    private notifyListeners(): void {
        for (const listener of this.listeners.values()) {
            listener()
        }
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
