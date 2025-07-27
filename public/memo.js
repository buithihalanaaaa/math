/*
while (i < str.length) {
  let substr = str.substr(i);
  let matched = false;
  for (const [tag, ops] of Object.entries(tagOperations)) {
    if (substr.startsWith(tag)) {
      //例として、"mi"の場合
      handleOpenTag(tag, ops.open);
      matched = true;
      break;
    } else if (substr.startsWith(tag.replace("<", "<\/"))) {
      //例として、<mi>の"<"を"</"に置き換え、</mi>になる場合
      handleCloseTag(tag, ops.close);
      matched = true;
      break;
    }
  }
  if (!matched) {
    if (substr.charAt(0) == "=") {
      if (treeStack[treeDepth - 3] == "<math mathsize=\"250%\" xmlns=\"http://www.w3.org/1998/Math/MathML\">") {
        equationFlag = 1;
      } else if (treeStack[treeDepth - 5] == "<math>" &&
        (treeStack[treeDepth - 3] == "<munder>" || treeStack[treeDepth - 3] == "<mover>" || treeStack[treeDepth - 3] == "<munderover>") &&
        munderoverCount == 1) {
        equationFlag = 1;
      }
      i++;
      
    } else if (substr.startsWith("<mi>[<\/mi><mtable>") || substr.startsWith("<mi>(<\/mi><mtable>")) {
      mtableStack[mtableDepth] = i;
      mtableDepth++;
      i += 18;
    } else if (substr.startsWith("<\/mtable><mi>]<\/mi>") || substr.startsWith("<\/mtable><mi>)<\/mi>")) {
      mtableDepth--;
      matrics[matricsNum] = str.substring(mtableStack[mtableDepth], i + 19);
      if (mtableDepth == 0) outerMatrics[outerMatricsNum++] = matrics[matricsNum];
      matricsNum++;
      i += 19;
    } else {
      i++;
    }
  }
}*/