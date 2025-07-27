#!/usr/bin/env ruby
#rubyのファイル名は4文字以下(例mreg.rb)じゃないと使えないかもしれません
require 'cgi'
require 'json'
require 'logger'

cgi = CGI.new()

mathStrs   = cgi.params['math'] #配列
#mathStrsB   = cgi.params['mathB'] #配列

regExpStr = cgi['query']

orgQuery = cgi['originalQuery']

#originalQuery 検索クエリの通常の文字列

mathStrssize = cgi['size']
lim = mathStrssize.to_i


regExp = Regexp.new(regExpStr)
#regExp = Regexp.new(mathStrsB)




results = [];
count = 0;
matchedMathNum = [];

#array = mathStrs

i=0;

for mStr in mathStrs do
#変数mstrにmathStrが順に代入されてfor文が処理される
#while i < lim do

#  r="!{" #置換後の文字列を作る．rはreplacementのこと．
#  for i in 0..(cgi['n'].to_i) do
#    r+="!{\\k<c"
#    r+=i.to_s
#    r+=">!}"
#  end
#  r+="!}"

  r="/::::::::::/{\\k<c0>/}" #mstyle要素のOnigmoパターン文字列

  count = count+1 #数式番号を数えておく．

  #m=mStr.gsub(regExp, r)#置換処理．
  m=mStr.gsub(regExp, r)#置換処理．


#  if m.index("{!") != nil then #マッチした数式の番号を格納．nil=null
#    matchedMathNum << count
#  end

log = Logger.new('./logfile')

  results << m#置換後の文字列を格納．
end





#ログを吐く
log.info( ENV['REMOTE_ADDR']+':' + orgQuery+": "+ regExpStr+ ": " + matchedMathNum.to_s)

data = {results: results}


# f.close;
cgi.out ({ "type" => "application/json", "charset" => "UTF-8" }) {
    data.to_json
}
