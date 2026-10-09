/**
 * Agreement between our Assessment and human scores on Anchor Responses.
 * Anchor corpora use their own scales (DREsS 1–5, ASAP 1–6), so we measure ranking (Spearman) and
 * agreement after a linear mapping onto the human scale, which is also the calibration we would ship.
 */

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

function ranks(xs: number[]) {
  const order = xs.map((v, i) => [v, i] as const).sort((a, b) => a[0] - b[0]);
  const r = new Array<number>(xs.length);
  for (let i = 0; i < order.length; ) {
    let j = i;
    while (j + 1 < order.length && order[j + 1][0] === order[i][0]) j++;
    for (let k = i; k <= j; k++) r[order[k][1]] = (i + j) / 2 + 1;
    i = j + 1;
  }
  return r;
}

function pearson(x: number[], y: number[]) {
  const mx = mean(x);
  const my = mean(y);
  let cov = 0;
  let vx = 0;
  let vy = 0;
  for (let i = 0; i < x.length; i++) {
    cov += (x[i] - mx) * (y[i] - my);
    vx += (x[i] - mx) ** 2;
    vy += (y[i] - my) ** 2;
  }
  return vx && vy ? cov / Math.sqrt(vx * vy) : 0;
}

export const spearman = (x: number[], y: number[]) => pearson(ranks(x), ranks(y));

/** Least-squares fit human ≈ slope · model + intercept. */
export function linearFit(model: number[], human: number[]) {
  const mx = mean(model);
  const my = mean(human);
  let num = 0;
  let den = 0;
  for (let i = 0; i < model.length; i++) {
    num += (model[i] - mx) * (human[i] - my);
    den += (model[i] - mx) ** 2;
  }
  const slope = den ? num / den : 0;
  return { slope, intercept: my - slope * mx };
}

export function summarize(model: number[], human: number[]) {
  const fit = linearFit(model, human);
  const mapped = model.map((m) => Math.round(fit.slope * m + fit.intercept));
  const err = mapped.map((m, i) => Math.abs(m - human[i]));
  return {
    n: model.length,
    spearman: Math.round(spearman(model, human) * 1000) / 1000,
    fit,
    maeAfterFit: Math.round(mean(err) * 100) / 100,
    exactAfterFit: Math.round((err.filter((e) => e === 0).length / err.length) * 100) / 100,
    adjacentAfterFit: Math.round((err.filter((e) => e <= 1).length / err.length) * 100) / 100,
  };
}
