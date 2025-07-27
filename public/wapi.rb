#!/usr/bin/env ruby
# ProgramGenreAPI-ver.2

require 'cgi'
require 'net/http'
require 'json'
require 'uri'

#puts "Content-Type: application/json\n"
#puts "Access-Control-Allow-Methods: GET,POST\n"
#puts "Access-Control-Allow-Origin: *\n\n"

cgi = CGI.new()

querymml = cgi['query']


INPUT = "input=#{querymml}"
APPID = 'appid=PRGGAY-YHE8VK2Q2X'
INCLUDEPODID = "includepodid=AlternateForm"
FORMAT = 'format=mathml'

uri = "http://api.wolframalpha.com/v2/query?appid=PRGGAY-YHE8VK2Q2X&#{INPUT}&includepodid=AlternateForm&includepodid=PositiveAlternateForm&includepodid=RealAlternateForm&includepodid=ExpandedForm&format=mathml"



uri = uri.gsub(" ","")

uri = URI.parse(uri)
req = Net::HTTP::Get.new(uri)
res = Net::HTTP.start(uri.host, uri.port){|http|
    http.request(req)
}

#res.body.delete!("<?xml version='1.0' encoding='UTF-8'?>")

# f.close
cgi.out ({ "type" => "text/html", "charset" => "UTF-8" }){
    res.body
}
