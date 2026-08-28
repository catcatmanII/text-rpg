# Simulation World Architecture

本專案的核心是可獨立運行的資料驅動模擬世界。LLM 不屬於核心依賴，未連接 LLM 時世界仍必須能推進、記錄與保存。

## Current milestone

Phase 1 — Simulation Kernel：已建立 `WorldRuntime`、`WorldClock`、`WorldState`、`EventLog` 與 JSON Save/Load。

## Tick contract

每次 Tick 固定先推進世界時間，再增加 state version，最後產生 `WORLD_TICK` 事件。後續 Agent、Goal、Action 與 Gameplay Rules 必須掛在 Tick 流程上，不得由 UI 直接修改 WorldState。

## Runtime boundaries

- `WorldRuntime`：生命週期與時間推進。
- `WorldState`：世界唯一狀態來源。
- `EventLog`：可追蹤的世界變化紀錄。
- `Persistence`：只負責序列化與還原，不負責遊戲規則。
- `Presentation`：後續只讀取 Snapshot 與 Event，不擁有 Runtime 狀態。
- `LLM Adapter`：後續可插拔，輸出必須經過規則驗證。

## Completed pre-LLM foundation

已完成 Entity、Zone、SpatialQuery、Agent、Goal、Action、Movement、LocalSearch、Combat、Economy、Replay、Save/Load、Player Command、Text Observer 與最小世界內容。最小世界已通過 1,000 Tick 無 LLM 連續運行測試。

LLM 接入邊界見 `LLM_BOUNDARY.md`。在進入 LLM Adapter 前，Core Contract 暫時凍結。
