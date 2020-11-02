
//Type safe ID, see https://basarat.gitbook.io/typescript/main-1/nominaltyping
type Id<T extends String> = {
    type: T,
    value: string,
}

export function equalIds<S extends string, T1 extends Id<S>, T2 extends Id<S>>(id1: T1, id2: T2): boolean {
    return id1.value === id2.value
}

export type BaseID = Id<'base'>
export type TableID = Id<'table'>
export type ColumnID = Id<'column'>
export type RowID = Id<'row'>
export type ListenerID = Id<'listener'>

export const newBaseId = (value: string): BaseID => ({type: "base", value})
export const newTableId = (value: string): TableID => ({type: "table", value})
export const newColumnId = (value: string): ColumnID => ({type: "column", value})
export const newRowId = (value: string): RowID => ({type: "row", value})
export const newListenerId = (value: string): ListenerID => ({type: "listener", value})

export interface Base {
    id: BaseID,
    name: string,
    tables: Table[],
}

export interface Table {
    id: TableID,
    name: string,
    columns: Array<Column>,
}

export interface Column {
    id: ColumnID,
    description: string,
    type: "string" | "number"
}

// The union of all possible cell values, will be expanded to include things
// like relationships, or formulae
export type CellValue = StringCellValue | NumericCellValue

export type StringCellValue = {
    type: "string",
    value: string,
}

export type NumericCellValue = {
    type: "number",
    value: number,
}


export interface Row {
    id: RowID,
    cellValue(columnId: ColumnID): CellValue | null
}

export interface RepoListener {
  (): void;
}

export interface DobbyRepo {
    listBases(): Promise<Base[]>,
    createTable(baseId: BaseID, name: string, columns: Array<Column>): Promise<Table>,
    rowsForTable(baseId: BaseID, tableId: TableID): Promise<Row[] | null>,
    insertColumn(baseId: BaseID, tableId: TableID, index: (number | null)): Promise<Column>,
    updateColumn(baseId: BaseID, tableId: TableID, columnId: ColumnID, description: (string | null), type: ("string" | "number" | null)): Promise<void>,
    insertRow(baseId: BaseID, tableId: TableID, index: (number | null), values: Map<ColumnID, CellValue>): Promise<Row>,
    updateRow(baseId: BaseID, tableId: TableID, rowId: RowID, newValues: Map<ColumnID, CellValue>): Promise<void>,
    deleteRow(baseId: BaseID, tableId: TableID, rowId: RowID): Promise<void>,
    addListener(listener: RepoListener): ListenerID
    removeListener(listenerId: ListenerID): void
}
