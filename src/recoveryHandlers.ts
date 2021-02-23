export interface RecoveryHandlers<TState> {
    [key: string]: (state: TState, event: any) => TState;
}
