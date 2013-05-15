class Event
  include Mongoid::Document

  belongs_to :user

  field :date, type: Date
  field :comment, type: String

end
