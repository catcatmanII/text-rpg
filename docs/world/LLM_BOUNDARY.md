# LLM 接入前邊界契約

目前世界核心已可在沒有 LLM 的情況下獨立運行。後續接入模型時，LLM 只能透過 Adapter 進入，不得成為 Simulation Kernel、Gameplay Rules 或 Persistence 的依賴。

## 可提供給 LLM 的資料

- `WorldSnapshot`
- NPC profile
- 最近世界事件
- Runtime 已產生的合法候選 Action

## LLM 不可直接修改的資料

- 座標與區域
- HP、MP、傷害與死亡
- Gold、物品與交易
- Goal 的安全限制
- 任務結果
- 世界時間

## 強制流程

```text
Runtime 產生候選 Action
→ LLM Adapter 選擇或描述
→ Schema 驗證
→ ActionValidator
→ ActionResolver
→ WorldState
```

模型逾時、未連線或格式錯誤時，必須回退至既有 deterministic 規則；世界不得停止。

## 架構凍結狀態

LLM 接入前的基礎架構已凍結。之後若要調整 Core Contract，必須建立新的 Architecture Revision，不得在 Adapter 開發中直接改寫既有世界規則。
