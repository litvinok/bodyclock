Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2,

           # ## http://epbyminsd3162t1.minsk.epam.com:3000/auth/google_oauth2/callback
           # "371260527969-5aijlaarh34bqbvqgotlrih2rumbp1b3.apps.googleusercontent.com",
           # "rC_vWjOZGyr4psLsbQZg961-",

           ## http://bodyclock.herokuapp.com/auth/google_oauth2/callback
           "371260527969-pvoqc0dng1ectb8n8u5fr3eskll3ofnd.apps.googleusercontent.com",
           "TNDCYHw7yuVjvRe5kjywP5y1",

          {
             :scope => "userinfo.email,userinfo.profile,plus.me,http://gdata.youtube.com",
             :approval_prompt => "auto"
           }

  provider :facebook, "358854700893028", "4b4b0fcbb0eb5d1a358a524204b947f7",
           :scope => 'email,user_birthday,read_stream'
end