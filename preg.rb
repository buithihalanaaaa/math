#! /usr/bin/ruby
#rubyのファイル名は4文字以下(例mreg.rb)じゃないと使えないかもしれません
require 'cgi'
require 'json'
require 'logger'



cgi = CGI.new()

#fname = "mreg.log"
#log = Logger.new(fname)

#cgi.params[]で、[]の中身を配列として受け取る
#cgi[]で、[]の中身をふつうに変数として受け取る
mathStrs   = cgi.params['math']
regExpStr = cgi['query']
orgQuery = cgi['originalQuery']

mathStrsl = cgi.params['mathl'] #対象mathml全部の左辺
mathStrsr = cgi.params['mathr'] #対象mathml全部の右辺
mathparser = cgi.params['mathparser'] #対象mathml全部の左辺と右辺を分ける記号(等号や不等号)

regExpStrl = cgi['queryl'] #検索する公式の左辺
regExpStrr = cgi['queryr'] #検索する公式の右辺
queryparser = cgi['queryparser'] #検索する公式の左辺と右辺を分ける記号

mathStrssize = cgi['size']
lim = mathStrssize.to_i


regExpl = Regexp.new(regExpStrl)
regExpr = Regexp.new(regExpStrr)
regExp = Regexp.new(regExpStr)

results = [];
count = 0;
matchedMathNum = [];

array = mathStrs

array.push(mathStrsl).push(mathStrsr)
array.flatten!
#for mStr in array do
i = 0;
#array.each do |mStr|
while i < lim do
  m  = nil
  ll = nil
  rr = nil

  replace = "{abcdefg}"

  r="/::::::::::/{\\k<c0>/}" #mstyle要素のOnigmoパターン文字列
  #/::::::::::/ 後でmstyleになる部分
  #{
  #\\k<c0> 検索クエリ中の(?<c0>うんたらかんたら)部分。ようは色付けしたい部分そのもの
  #/}

  #sample: xhtml上の数式「a^2 + b^2 + 3 = c^2 + 3」から、ピタゴラスの定理を検索する

  #https://gam0022.net/blog/2013/02/09/ruby-variable/
  #rubyで変数を扱う場合は注意が必要

 # lkari = array[i+lim].dup #dupつけないと番地も変わっちゃう
  #lhikaku = lkari.gsub!(regExpl, replace) #sample: a^2 + b^2 + 3 → {abcdefg} + 3
#  rkari = array[i+lim+lim].dup
#  rhikaku = rkari.gsub!(regExpr, replace) #sample: c^2 + 3 → {abcdefg} + 3

  count = count+1 #数式番号を数えておく．

#  if(queryparser != mathparser[i]) then #公式クエリの等号不等号と、mathStrの等号不等号が一致していれば1, 一致していなければ0
#    kigoucheck = 0 #たとえ左辺右辺が一致してても、等号不等号が違うので弾く
#  else
#    kigoucheck = 1 #等号不等号のチェックはok
#  end

#  if(lhikaku != rhikaku) then #左辺と右辺が一致していなければマッチしない
    m=array[i+lim] + mathparser[i] + array[i+lim+lim]
#  else #左辺と右辺が一致していれば、等号不等号のチェックを行う
#    if(kigoucheck != 0) then #等号不等号が一致していれば
      m=array[i+lim].gsub(regExpl, r) + mathparser[i] + array[i+lim+lim].gsub(regExpr, r)#マッチした
#    else #左辺右辺は一致してても等号不等号が異なっている場合は、マッチしない
#      m=array[i]
#    end
#  end

  if m.index("{!") != nil then #マッチした数式の番号を格納．nil=null
    matchedMathNum << count
  end
  i = i+1
  results << m#置換後の文字列を格納．
end




#ログを吐く
#log.info( ENV['REMOTE_ADDR']+':' + orgQuery+": "+matchedMathNum.to_s)

data = {results: results}


# f.close;
cgi.out ({ "type" => "application/json", "charset" => "UTF-8" }) {
    data.to_json
}
