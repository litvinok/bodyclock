class Type
  include Mongoid::Document

  has_many :event

  field :name, type: String
  field :model, type: String

  index({ model: 1 }, { unique: true, background: true })

end
