The 专家顾问团 seat — photo + short title, per the brand's own description of the expert roster.

```jsx
<ExpertCard name="王明" title="淮扬菜出品顾问" field="菜品结构 · 出餐标准"
  photo="../../assets/experts/wang.jpg" tags={["出餐标准", "菜单结构"]} />
<ExpertCard name="李静" title="连锁运营顾问" layout="row" size={72} />
```

Keep the 头衔 to one line — it is a credential, not a bio. Four across reads best in a grid;
use `layout="row"` in sidebars. No photo means a labelled placeholder, which is the correct
visible state until 侍天 supplies portraits.
