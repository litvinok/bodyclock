class Event
  include Mongoid::Document

  belongs_to :user
  belongs_to :type

  field :date, type: Date
  field :value, type: Float
  field :comment, type: String

  index({ date: 1, user: 1 }, { unique: true, background: true })

end
