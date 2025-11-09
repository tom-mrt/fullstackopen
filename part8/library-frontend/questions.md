- useMemoの仕様を、具体例をあげながら解説して。
  - 回答: `useMemo(factory, deps)` は「高コストな計算結果や配列/オブジェクトの参照を、依存配列 `deps` が変わった時だけ再計算して、それ以外の再レンダーでは同じ参照を再利用する」ためのフックです。副作用は入れず、純粋計算の結果を返す用途に限定します。
  - 使い所: 絞り込み・ソート・重複排除・巨大配列のマッピング結果など、再計算コストや再レンダーの差分判定コストを下げたい時。
  - 具体例（本一覧からユニークなジャンルを算出）:
    ```js
    const genres = useMemo(() => {
      const s = new Set();
      for (const b of books) for (const g of b.genres ?? []) s.add(g);
      return [...s].sort();
    }, [books]);
    ```
  - 注意点:
    - 依存配列に計算内で参照する値を漏らさない。
    - 「なんでもかんでも useMemo」は逆効果。計算が軽い場合は不要。
    - `useCallback` は「関数」をメモ化、`useMemo` は「値（結果）」をメモ化。
- buttonタグのaria-pressedプロパティの仕様、役割を解説して。
  - 回答: `aria-pressed` はトグルボタン（オン/オフを持つボタン）の現在状態をスクリーンリーダーに伝えるための ARIA 属性です。`<button>` に付け、押下（オン）なら `true`、解除（オフ）なら `false` を設定します。
  - 値: `true` | `false` | `mixed`（三状態） | 省略（未定義）。
  - 例:
    ```html
    <button aria-pressed="true">Favorite</button>
    <button aria-pressed="false">Favorite</button>
    ```
  - 使い分け:
    - チェックボックス的な UI でも見た目が「ボタン」なら `aria-pressed`。
    - リスト項目の選択などは `aria-selected`、チェックボックスなら `role="checkbox" aria-checked` を検討。
  - 補足: キーボード操作は Space/Enter を許容し、状態変更時に `aria-pressed` を確実に更新する。
- javascriptにおいて、値がnullの場合の??と||の挙動の違いを解説して。
  - 回答: `??`（null合体演算子）は「左辺が `null` または `undefined` のときだけ」右辺を返します。`||`（論理和）は「左辺が falsy（`0`、`''`、`false`、`NaN`、`null`、`undefined`）のとき」右辺を返します。
  - 違いの例:
    ```js
    0   ?? 42   // 0      （0 は null/undefined ではない）
    0   || 42   // 42     （0 は falsy）
    ''  ?? 'x'  // ''     （空文字は null/undefined ではない）
    ''  || 'x'  // 'x'    （空文字は falsy）
    null ?? 'x' // 'x'
    null || 'x' // 'x'
    ```
  - 実践指針: 「未設定（null/undefined）のみを補完」したいなら `??`、単に「falsy をデフォルト置換」したいなら `||`。
  - 注意: `??` と `||`/`&&` を同じ式で混在させる場合は括弧で明示する（構文規則・可読性のため）。
- 配列のflatMapメソッドの仕様を、具体令をあげながら解説して。