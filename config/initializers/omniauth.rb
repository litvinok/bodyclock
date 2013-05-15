AUTH_CONFIG = YAML.load_file("#{::Rails.root}/config/omiauth.yml")[::Rails.env]

Rails.application.config.middleware.use OmniAuth::Builder do

  AUTH_CONFIG.each do | type, params |

        puts params

        provider type, params[ "app_id" ], params[ "secret" ], params[ "options" ] || {}

  end

end