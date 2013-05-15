class Event
  include Mongoid::Document

  field :date, type: Date

  belongs_to :user
  embeds_many :value

  index({ date: 1, user: 1 }, { unique: true, background: true })

end
