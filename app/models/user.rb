class User
  include Mongoid::Document

  field :name, type: String
  field :provider, type: String
  field :uid, type: String
  field :refresh_token, type: String
  field :access_token, type: String
  field :expires, type: DateTime

  field :email, type: String
  field :avatar, type: String
  field :gender, type: String
  field :birthday, type: Date

  index({ uid: 1, provider: 1 }, { unique: true })
end
