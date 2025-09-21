class DefaultResponseDto {
  constructor(success, message, data) {
    this.success = success;
    this.message = message;
    this.data = data || null;
  }
}

module.exports = DefaultResponseDto;
