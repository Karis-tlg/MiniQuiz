import { LitElement, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import "../components/icon"
import "../components/navbar"
import "../components/dropdown"

@customElement("page-legal")
export class PageLegal extends LitElement {
    @state() tab: number = 0
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    render() {
        return html`
            <element-navbar></element-navbar>

            <div class="mt-16">
                <h1 class="px-4 text-3xl font-bold text-default-text">Danh sách yêu cầu dịch vụ</h1>
                <p class="px-4 text-default-text-sub text-xl">Vui lòng đọc kỹ. Đây là những yêu cầu cần tuân thủ khi sử dụng dịch vụ</p>

                <div class="w-full flex items-center justify-center border-y border-gray-700 bg-gray-700/25 backdrop-blur-lg mt-10 p-5">
                    <div class="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button @click=${() => {this.tab = 0}} class="w-full py-3 ${this.tab === 0 ? "bg-indigo-600" : "bg-gray-700"} hover:bg-indigo-600 rounded-lg text-white font-semibold transition-colors">
                            <element-icon icon="book"></element-icon> Terms of Service
                        </button>
                        <button @click=${() => {this.tab = 1}} class="w-full py-3 ${this.tab === 1 ? "bg-indigo-600" : "bg-gray-700"} hover:bg-indigo-600 rounded-lg text-white font-semibold transition-colors">
                            <element-icon icon="shield-half"></element-icon> Privacy Policy
                        </button>
                    </div>
                </div>

                <div class="w-full border-y border-gray-700 bg-gray-700/25 backdrop-blur-lg mt-10 p-5">
                    <h2 class="block text-2xl font-bold text-default-primary mb-1"><i class="fa-solid fa-book-open"></i> ${this.tab === 0 ? "Terms of Service" : "Privacy Policy"}</h2>
                    <p class="block text-default-text-sub">Cập nhật lần cuối: 01/01/2026</p>
                    
                    <!-- Terms of Service -->
                    <div .hidden=${this.tab !== 0} class="mt-5 flex flex-col gap-y-4">
                        <element-dropdown-text class="w-full" 
                            summary="1. Chấp nhận điều khoản" 
                            details="Bằng việc đăng nhập và sử dụng ứng dụng này, bạn đồng ý tuân thủ các điều khoản và quy định được nêu tại đây.">
                        </element-dropdown-text>

                        <element-dropdown-text class="w-full" 
                            summary="2. Tài khoản người dùng" 
                            details="Bạn chịu trách nhiệm bảo mật tài khoản cá nhân (Email, Discord, Google) và mọi hoạt động diễn ra dưới tài khoản của bạn khi tạo hoặc làm Quiz.">
                        </element-dropdown-text>

                        <element-dropdown-text class="w-full" 
                            summary="3. Nội dung người dùng" 
                            details="Bạn không được phép đăng tải các nội dung vi phạm pháp luật, nội dung khiêu dâm, bạo lực, hoặc vi phạm bản quyền trí tuệ lên hệ thống Quiz của chúng tôi.">
                        </element-dropdown-text>

                        <element-dropdown-text class="w-full" 
                            summary="4. Quyền sở hữu" 
                            details="Chúng tôi sở hữu giao diện và mã nguồn ứng dụng, trong khi bạn sở hữu nội dung Quiz bạn tạo ra nhưng cho phép chúng tôi hiển thị chúng trên hệ thống.">
                        </element-dropdown-text>

                        <element-dropdown-text class="w-full" 
                            summary="5. Giới hạn trách nhiệm" 
                            details="Ứng dụng được cung cấp 'như hiện có' (As-Is); chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại hoặc mất mát dữ liệu nào phát sinh khi sử dụng.">
                        </element-dropdown-text>

                        <element-dropdown-text class="w-full" 
                            summary="6. Chấm dứt dịch vụ" 
                            details="Chúng tôi có quyền khóa hoặc xóa tài khoản của bạn mà không cần báo trước nếu phát hiện hành vi gian lận, phá hoại hệ thống hoặc vi phạm điều khoản.">
                        </element-dropdown-text>

                        <element-dropdown-text class="w-full" 
                            summary="7. Thay đổi chính sách" 
                            details="Chúng tôi có thể cập nhật các điều khoản này bất kỳ lúc nào. Khi có thay đổi, chúng tôi sẽ đăng tải trên trang web hoặc thông báo qua email bạn đăng kí.">
                        </element-dropdown-text>
                    </div>

                    <!-- Privacy Policy -->
                    <div .hidden=${this.tab !== 1} class="mt-5 flex flex-col gap-y-4">
                        <element-dropdown-text class="w-full"
                            summary="1. Thông tin chúng tôi thu thập"
                            details="Chúng tôi chỉ thu thập thông tin định danh cơ bản (Tên, Email, Ảnh đại diện) khi bạn đăng nhập qua Google/Discord/Email và nội dung các bài Quiz bạn tạo hoặc tham gia để vận hành ứng dụng.">
                        </element-dropdown-text>
                        <element-dropdown-text class="w-full" 
                            summary="2. Mục đích sử dụng dữ liệu" 
                            details="Dữ liệu của bạn được sử dụng duy nhất để duy trì tài khoản đăng nhập, lưu trữ lịch sử làm bài, hiển thị bảng xếp hạng và đảm bảo các tính năng của Quiz hoạt động ổn định.">
                        </element-dropdown-text>
                        <element-dropdown-text class="w-full" 
                            summary="3. Bảo mật dữ liệu" 
                            details="Chúng tôi áp dụng các biện pháp bảo mật để bảo vệ dữ liệu người dùng. Nhưng, không có gì an toàn tuyệt đối do đó, chúng tôi không thể đảm bảo 100% dữ liệu sẽ được an toàn tuyệt đối trước mọi rủi ro.">
                        </element-dropdown-text>
                        <element-dropdown-text class="w-full" 
                            summary="4. Lưu trữ dữ liệu" 
                            details="Dữ liệu sẽ được lưu trữ đến khi bạn có yêu cầu xóa tài khoản và dữ liệu Quiz. Có thể yêu cầu xoá bất cứ khi nào thông qua các nút xoá trong ứng dụng. Nếu cần hỗ trợ có thể gửi email đến 'dangkida9@gmail.com'">
                        </element-dropdown-text>
                        <element-dropdown-text class="w-full" 
                            summary="5. Thay đổi chính sách" 
                            details="Chúng tôi có thể cập nhật Chính Sách Bảo Mật(Privacy Policy) tùy theo yêu cầu phát triển dịch vụ hoặc quy định pháp luật. Khi có thay đổi, chúng tôi sẽ đăng tải trên trang web hoặc thông báo qua email bạn đăng kí.">
                        </element-dropdown-text>
                    </div>
                </div>
            </div>
        `
    }
}