import {Component, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {CustomSocketService, SocketEvent} from "../../services/custom-socket/custom-socket.service";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class StartComponent implements OnInit {

  constructor(
    private customSocketService: CustomSocketService
  ) {
  }

  ngOnInit(): void {

    this.customSocketService.onEvent(this.customSocketService.socketUrl, SocketEvent.FROM_UI).subscribe((d: any) => {
      console.log(`onEvent !!!!!!!!!!!! ${d}`);
    })
  }
}
