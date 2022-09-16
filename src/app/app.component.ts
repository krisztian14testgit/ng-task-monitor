import { AfterViewInit, Component } from '@angular/core';
import { AlertType } from './components/alert-window/alert.model';
import { AlertMessageService } from './services/alert-message/alert-message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  constructor(private readonly alertService: AlertMessageService) {}

  ngAfterViewInit(): void {
    const noAPI = `This app hasn't been linked with web API yet!`;
    this.alertService.sendMessage(noAPI, AlertType.Info);
  }
}
