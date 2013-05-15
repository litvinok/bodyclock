class Value
  include Mongoid::Document

  belongs_to :type
  field :value, type: Float

end
