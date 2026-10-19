/// <reference types="node" />
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { rankCandidates } from "./election";

describe("election ranking", () => {
  it("gives tied candidates the same rank and skips the next position", () => {
    const ranked = rankCandidates([
      { id: "a", name: "Ana", votes: 5 },
      { id: "b", name: "João", votes: 5 },
      { id: "c", name: "Pedro", votes: 2 },
    ]);
    assert.deepEqual(ranked.map(candidate => candidate.rank), [1, 1, 3]);
    assert.deepEqual(ranked.map(candidate => candidate.tied), [true, true, false]);
  });

  it("sorts standings without moving the original voting controls", () => {
    const candidates = [
      { id: "a", name: "Ana", votes: 1 },
      { id: "b", name: "João", votes: 3 },
    ];
    assert.deepEqual(rankCandidates(candidates).map(candidate => candidate.id), ["b", "a"]);
    assert.deepEqual(candidates.map(candidate => candidate.id), ["a", "b"]);
  });
});