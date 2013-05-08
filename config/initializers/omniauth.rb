Rails.application.config.middleware.use OmniAuth::Builder do

  provider :google_oauth2,

           ## http://epbyminsd3162t1.minsk.epam.com:3000/auth/google_oauth2/callback
           # "371260527969-5aijlaarh34bqbvqgotlrih2rumbp1b3.apps.googleusercontent.com",
           # "rC_vWjOZGyr4psLsbQZg961-",

           ## http://bodyclock.herokuapp.com/auth/google_oauth2/callback
           "371260527969-pvoqc0dng1ectb8n8u5fr3eskll3ofnd.apps.googleusercontent.com",
           "TNDCYHw7yuVjvRe5kjywP5y1",

          {
             :scope => "userinfo.email,userinfo.profile,plus.me,http://gdata.youtube.com",
             :approval_prompt => "auto"
           }

  provider :yandex, "979e4559c7734a638222a41851fb6ab6", "d9de3dd060824f838f0f8b6d811fa809"

  provider :facebook, "358854700893028", "4b4b0fcbb0eb5d1a358a524204b947f7",
           :scope => 'email,user_birthday,read_stream'

  provider :vkontakte, "3628707", "PqmjnTMxi5STNwOu1rKQ",
           :scope => 'notify,friends,photos,notes,docs,pages,wall,offline'
end