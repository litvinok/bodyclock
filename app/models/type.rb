class Type
  include Mongoid::Document

  has_many :value

  field :uid, type: String
  field :name, type: String

  index({ uid: 1 }, { unique: true, background: true })

end
