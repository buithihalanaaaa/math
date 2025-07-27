require 'sinatra'
require 'json'

configure do
  set :bind, '0.0.0.0'
  set :port, 8000
  set :environment, :development
  set :host_authorization, { permitted_hosts: [] }  # ✅ cho phép mọi host
end

before do 
  headers 'Access-Control-Allow-Origin' => '*'
end

get '/' do
  "✅ Sinatra is working! #{Time.now}"
end

post '/mreg' do
  content_type :json
  math = params['math'] || []
  query = params['query'] || ''
  results = math.map { |m| m.gsub(Regexp.new(query), '/::::::::::/{\\k<c0>/}') }
  { results: results }.to_json
end
